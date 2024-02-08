import { Prisma } from '@prisma/client';

import * as client from 'lib/client';
import * as I from 'interface';
import * as helpers from 'lib/helpers';

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
            role: true
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
            role: true
        },
        data: {
            email
        },
        where: {
            orcid
        }
    });

export const getAll = async (filters: I.UserFilters) => {
    const query = {};

    if (filters.search) {
        const searchQuery = helpers.sanitizeSearchQuery(filters.search);
        // @ts-ignore
        query.where = {
            firstName: {
                search: searchQuery
            },
            lastName: {
                search: searchQuery
            }
        };
    }

    // @ts-ignore
    const users = await client.prisma.user.findMany({
        take: Number(filters.limit) || 10,
        skip: Number(filters.offset) || 0,
        orderBy: {
            [filters.orderBy || 'updatedAt']: filters.orderDirection || 'desc'
        },
        ...query,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            orcid: true,
            employment: true
        }
    });

    // @ts-ignore
    const totalUsers = await client.prisma.user.count(query);

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
            orcidAccessToken: isAccountOwner ? true : false
        }
    });

export const getPublications = async (
    id: string,
    params: I.UserPublicationsFilters,
    isAccountOwner: boolean,
    versionStatusArray?: I.PublicationStatusEnum[]
) => {
    const { offset, limit } = params;

    const where: Prisma.PublicationWhereInput = {
        OR: [
            {
                versions: {
                    some: {
                        createdBy: id
                    }
                }
            },
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
            }
        ],
        ...(isAccountOwner
            ? versionStatusArray
                ? {
                      versions: {
                          some: {
                              currentStatus: {
                                  in: versionStatusArray
                              }
                          }
                      }
                  }
                : {}
            : { versions: { some: { isLatestLiveVersion: true } } })
    };

    const userPublications = await client.prisma.publication.findMany({
        skip: offset,
        take: limit,
        where,
        include: {
            versions: {
                where: {
                    ...(isAccountOwner
                        ? // The owner of the account gets all live versions, and the draft if they are an author on it
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
                                  }
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
            }
        }
    });

    const totalUserPublications = await client.prisma.publication.count({ where });

    // Because the sorting is conditional on the publication state of a publication's versions, we can't do it in prisma.
    const sortedPublications = isAccountOwner // If account owner, put publications with an active draft first (sub-sorted by updated time descending), then others (sub-sorted by published date descending)
        ? userPublications.sort((a, b) => {
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
        : userPublications.sort((a, b) => {
              const aLatestLive = a.versions.find((version) => version.isLatestLiveVersion);
              const bLatestLive = b.versions.find((version) => version.isLatestLiveVersion);

              if (aLatestLive?.publishedDate && bLatestLive?.publishedDate) {
                  return bLatestLive.publishedDate.getTime() - aLatestLive.publishedDate.getTime();
              } else {
                  return 0;
              }
          });

    return { offset, limit, total: totalUserPublications, results: sortedPublications };
};

export const getUserList = async () => {
    const users = await client.prisma.user.findMany({
        select: {
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
            employment: true
        }
    });

    return users.map(({ firstName, lastName, email, createdAt, employment }) => ({
        firstName,
        lastName,
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
