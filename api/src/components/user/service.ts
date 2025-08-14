import { Prisma } from '@prisma/client';

import * as client from 'lib/client';
import * as I from 'interface';
import * as Helpers from 'lib/helpers';

export const upsertUser = (orcid: string, updateUserInformation: I.UpdateUserInformation) =>
    client.prisma.user.upsert({
        select: {
            email: true,
            id: true,
            createdAt: true,
            firstName: true,
            lastName: true,
            locked: true,
            orcid: true,
            role: true,
            defaultTopicId: true
        },
        where: {
            orcid
        },
        update: { ...updateUserInformation },
        create: {
            orcid,
            ...updateUserInformation
        }
    });

export const updateEmail = (orcid: string, email: string) =>
    client.prisma.user.update({
        select: {
            email: true,
            id: true,
            createdAt: true,
            firstName: true,
            lastName: true,
            locked: true,
            orcid: true,
            role: true,
            defaultTopicId: true
        },
        data: {
            email
        },
        where: {
            orcid
        }
    });

export const getAll = async (filters: I.UserFilters) => {
    const prismaFilters: Prisma.UserWhereInput[] = [];

    if (filters.search) {
        const searchQuery = Helpers.sanitizeSearchQuery(filters.search);
        prismaFilters.push({
            OR: [
                {
                    firstName: {
                        search: searchQuery + ':*'
                    }
                },
                {
                    lastName: {
                        search: searchQuery + ':*'
                    }
                }
            ]
        });
    } else {
        // Exclude unnamed users.
        prismaFilters.push({
            OR: [
                {
                    firstName: {
                        not: ''
                    }
                },
                {
                    lastName: {
                        not: ''
                    }
                }
            ]
        });
    }

    if (filters.role) {
        const basicRoleFilter = {
            role: filters.role
        };
        prismaFilters.push(
            filters.role === 'ORGANISATION'
                ? {
                      AND: [
                          basicRoleFilter,
                          {
                              publicationVersions: {
                                  some: {
                                      currentStatus: 'LIVE'
                                  }
                              }
                          }
                      ]
                  }
                : basicRoleFilter
        );
    }

    const where = {
        AND: prismaFilters
    };

    const users = await client.prisma.user.findMany({
        take: Number(filters.limit) || 10,
        skip: Number(filters.offset) || 0,
        orderBy: {
            [filters.orderBy || 'updatedAt']: filters.orderDirection || 'desc'
        },
        where,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            orcid: true,
            employment: true
        }
    });

    const totalUsers = await client.prisma.user.count({ where });

    return {
        data: users,
        metadata: {
            total: totalUsers,
            limit: Number(filters.limit) || 10,
            offset: Number(filters.offset) || 0
        }
    };
};

export const getByApiKey = (apiKey: string) =>
    client.prisma.user.findFirst({
        where: {
            apiKey
        }
    });

export const getByOrcid = (orcid: string) =>
    client.prisma.user.findFirst({
        where: {
            orcid
        }
    });

export const get = (id: string, isAccountOwner = false) =>
    client.prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            orcid: true,
            email: isAccountOwner ? true : false,
            role: true,
            createdAt: true,
            updatedAt: true,
            employment: true,
            education: true,
            works: true,
            orcidAccessToken: isAccountOwner ? true : false,
            locked: true,
            defaultTopicId: true,
            settings: {
                select: {
                    enableBookmarkNotifications: true,
                    enableBookmarkVersionNotifications: true,
                    enableBookmarkFlagNotifications: true
                }
            },
            lastBulletinSentAt: true
        }
    });

export const getPublications = async (
    id: string,
    params: I.UserPublicationsFilters,
    isAccountOwner: boolean,
    versionStatusArray?: I.PublicationStatusEnum[]
) => {
    const { offset, limit, initialDraftsOnly } = params;

    const user = await client.prisma.user.findUnique({
        where: {
            id
        }
    });

    const requestingNonLiveVersions =
        versionStatusArray?.some((status) => status === 'DRAFT' || status === 'LOCKED') || initialDraftsOnly;

    // WHERE clauses related to the user's authorship of a publication.
    const authorshipFilter: Prisma.PublicationWhereInput = {
        OR: [
            // User is corresponding author on at least one version, or
            {
                versions: {
                    some: {
                        createdBy: id
                    }
                }
            },
            // User is a confirmed coauthor on at least one version, or
            {
                versions: {
                    some: {
                        coAuthors: {
                            some: {
                                linkedUser: id
                            }
                        }
                    }
                }
            },
            // They are an unconfirmed coauthor on at least one version
            // (if the user is requesting their own publications and including non-live ones)
            ...(isAccountOwner && user?.email && requestingNonLiveVersions
                ? [
                      {
                          versions: {
                              some: {
                                  coAuthors: {
                                      some: {
                                          email: user.email,
                                          approvalRequested: true,
                                          linkedUser: null
                                      }
                                  }
                              }
                          }
                      }
                  ]
                : [])
        ]
    };

    // WHERE clauses related to the requested publication status of publications.
    let versionStatusFilter: Prisma.PublicationWhereInput;

    if (!isAccountOwner) {
        versionStatusFilter = {
            versions: {
                some: {
                    isLatestLiveVersion: true
                }
            }
        };
    } else {
        if (initialDraftsOnly) {
            versionStatusFilter = {
                versions: {
                    every: {
                        currentStatus: {
                            not: {
                                equals: 'LIVE'
                            }
                        },
                        versionNumber: 1
                    }
                }
            };
        } else if (versionStatusArray) {
            versionStatusFilter = {
                versions: {
                    some: {
                        currentStatus: {
                            in: versionStatusArray
                        }
                    }
                }
            };
        } else {
            versionStatusFilter = {};
        }
    }

    // Get publications where:
    const where: Prisma.PublicationWhereInput = {
        ...authorshipFilter,
        ...versionStatusFilter,
        // If a query is supplied, the query matches the title from the latest version (latest live if not account owner).
        ...(params.query && {
            versions: {
                some: {
                    ...(isAccountOwner ? { isLatestVersion: true } : { isLatestLiveVersion: true }),
                    title: {
                        contains: Helpers.sanitizeSearchQuery(params.query),
                        mode: 'insensitive'
                    }
                }
            }
        }),
        // If a publication is to be excluded, it is not included in the results.
        ...(params.exclude && { id: { notIn: params.exclude.split(',') } }),
        // If type filters are provided, the publication type matches one of the provided types.
        ...(params.type && {
            type: {
                in: params.type.split(',') as I.PublicationType[]
            }
        })
    };

    const userPublications = await client.prisma.publication.findMany({
        skip: offset,
        take: limit,
        where,
        include: {
            versions: {
                where: {
                    ...(isAccountOwner
                        ? // The owner of the account gets all live versions, and the draft
                          // if they are an author on it (confirmed or unconfirmed)
                          {
                              OR: [
                                  { currentStatus: 'LIVE' },
                                  {
                                      createdBy: id
                                  },
                                  {
                                      coAuthors: {
                                          some: {
                                              linkedUser: id
                                          }
                                      }
                                  },
                                  ...(user?.email
                                      ? [
                                            {
                                                coAuthors: {
                                                    some: {
                                                        email: user.email
                                                    }
                                                }
                                            }
                                        ]
                                      : [])
                              ]
                          }
                        : // Other users viewing a user's profile just need the latest live version
                          { isLatestLiveVersion: true })
                },
                include: {
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            id: true,
                            orcid: true
                        }
                    },
                    coAuthors: {
                        select: {
                            id: true,
                            linkedUser: true,
                            confirmedCoAuthor: true,
                            user: {
                                select: {
                                    orcid: true,
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        },
                        orderBy: {
                            position: 'asc'
                        }
                    }
                }
            },
            linkedFrom: {
                where: {
                    publicationFrom: {
                        type: 'PEER_REVIEW',
                        versions: {
                            some: {
                                isLatestLiveVersion: true
                            }
                        }
                    }
                }
            },
            publicationFlags: {
                where: {
                    resolved: false
                }
            }
        }
    });

    const totalUserPublications = await client.prisma.publication.count({ where });

    // Provide counts
    const mappedPublications = userPublications.map((publication) => {
        // Remove linkedFrom and flags from return
        const { linkedFrom, publicationFlags, ...rest } = publication;

        return {
            ...rest,
            flagCount: publication.publicationFlags.length,
            peerReviewCount: publication.linkedFrom.length
        };
    });

    // Because the sorting is conditional on the publication state of a publication's versions, we can't do it in prisma.
    const sortedPublications = isAccountOwner // If account owner, put publications with an active draft first (sub-sorted by updated time descending), then others (sub-sorted by published date descending)
        ? mappedPublications.sort((a, b) => {
              const aLatest = a.versions.find((version) => version.isLatestVersion);
              const bLatest = b.versions.find((version) => version.isLatestVersion);

              if (!(aLatest && bLatest)) {
                  return 0;
              }

              if (aLatest.currentStatus !== 'LIVE' && bLatest.currentStatus === 'LIVE') {
                  return -1;
              } else if (aLatest.currentStatus === 'LIVE' && bLatest.currentStatus !== 'LIVE') {
                  return 1;
              } else if (aLatest.currentStatus === 'LIVE' && bLatest.currentStatus === 'LIVE') {
                  // Sort by publication date
                  if (aLatest.publishedDate && bLatest.publishedDate) {
                      return bLatest.publishedDate.getTime() - aLatest.publishedDate.getTime();
                  } else {
                      return 0;
                  }
              } else {
                  // Neither publication's latest version is live - sort by updated date
                  return bLatest.updatedAt.getTime() - aLatest.updatedAt.getTime();
              }
          }) // If not account owner, we only have latest live publications - sort by published date descending
        : mappedPublications.sort((a, b) => {
              const aLatestLive = a.versions.find((version) => version.isLatestLiveVersion);
              const bLatestLive = b.versions.find((version) => version.isLatestLiveVersion);

              if (aLatestLive?.publishedDate && bLatestLive?.publishedDate) {
                  return bLatestLive.publishedDate.getTime() - aLatestLive.publishedDate.getTime();
              } else {
                  return 0;
              }
          });

    return { data: sortedPublications, metadata: { offset, limit, total: totalUserPublications } };
};

export const getUserList = async () => {
    const users = await client.prisma.user.findMany({
        select: {
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            createdAt: true,
            employment: true
        }
    });

    return users.map(({ firstName, lastName, role, email, createdAt, employment }) => ({
        firstName,
        lastName,
        role,
        email,
        createdAt: createdAt.toLocaleDateString('en-GB', { dateStyle: 'short' }),
        currentEmployer: (employment as unknown as I.UserEmployment[])
            .filter(
                (employment) =>
                    !employment?.endDate || Object.values(employment?.endDate).every((value) => value === null)
            )
            .map((employment) => employment?.organisation)
            .join(', ')
    }));
};

export const createManyUsers = async (users: Prisma.UserCreateInput[]) =>
    // Use this abstraction in order to return the created users.
    // Using createMany only returns { count: X }.
    await client.prisma.$transaction(users.map((user) => client.prisma.user.create({ data: user })));

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) =>
    await client.prisma.user.update({
        data,
        where: {
            id
        }
    });

export const getBookmarkedUsers = async (publicationId: string) => {
    return client.prisma.user.findMany({
        where: {
            bookmarks: {
                some: {
                    entityId: publicationId
                }
            }
        },
        select: {
            id: true
        }
    });
};

export const getUserSettings = async (id: string) =>
    client.prisma.userSettings.findUnique({
        where: {
            userId: id
        }
    });

export const updateUserSettings = async (id: string, settings: Prisma.UserSettingsUpdateInput) =>
    client.prisma.userSettings.upsert({
        where: {
            userId: id
        },
        update: settings,
        create: {
            userId: id,
            enableBookmarkNotifications: !!settings.enableBookmarkNotifications,
            enableBookmarkVersionNotifications: !!settings.enableBookmarkVersionNotifications,
            enableBookmarkFlagNotifications: !!settings.enableBookmarkFlagNotifications
        }
    });
