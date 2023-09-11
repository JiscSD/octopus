import { Prisma } from '@prisma/client';

import * as client from 'lib/client';
import * as I from 'interface';
import * as helpers from 'lib/helpers';

export const upsertUser = async (orcid: string, updateUserInformation: I.UpdateUserInformation) => {
    const user = await client.prisma.user.upsert({
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

    return user;
};

export const updateEmail = async (orcid: string, email: string) => {
    const user = await client.prisma.user.update({
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

    return user;
};

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

export const getByApiKey = async (apiKey: string) => {
    const user = await client.prisma.user.findFirst({
        where: {
            apiKey
        }
    });

    return user;
};

export const get = async (id: string, isAccountOwner = false) => {
    const user = await client.prisma.user.findUnique({
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

    return user;
};

export const getPublications = async (id: string, params: I.UserPublicationsFilters, isAccountOwner: boolean) => {
    const { offset, limit, orderBy, orderDirection } = params;

    // Account owners can retrieve their DRAFT publications also
    const statuses: Array<I.ValidStatuses> = isAccountOwner ? ['DRAFT', 'LIVE', 'LOCKED'] : ['LIVE'];

    const where: Prisma.PublicationWhereInput = {
        OR: [
            {
                versions: {
                    some: {
                        isCurrent: true,
                        createdBy: id
                    }
                }
            },
            {
                versions: {
                    some: {
                        isCurrent: true,
                        coAuthors: {
                            some: {
                                linkedUser: id
                            }
                        }
                    }
                }
            }
        ],
        versions: {
            some: {
                isCurrent: true,
                currentStatus: {
                    in: statuses
                }
            }
        }
    };

    const userPublications = await client.prisma.publication.findMany({
        skip: offset,
        take: limit,
        where,
        select: {
            id: true,
            type: true,
            doi: true,
            url_slug: true,
            versions: {
                where: {
                    isCurrent: true
                },
                select: {
                    createdBy: true,
                    createdAt: true,
                    updatedAt: true,
                    title: true,
                    publishedDate: true,
                    currentStatus: true,
                    licence: true,
                    content: true,
                    coAuthors: {
                        select: {
                            id: true,
                            approvalRequested: true,
                            confirmedCoAuthor: true,
                            code: true,
                            email: true,
                            publicationVersionId: true,
                            linkedUser: true,
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
        },
        orderBy:
            orderBy && orderDirection
                ? {
                      [orderBy]: orderDirection
                  }
                : undefined
    });

    // Simplify publications
    const simplifiedPublications = userPublications.map((publication) => {
        const simplifiedPublication = {
            ...publication,
            ...publication.versions[0]
        };
        // Discard versions field
        const { versions, ...simplifiedPublicationRest } = simplifiedPublication;

        return simplifiedPublicationRest;
    });

    const totalUserPublications = await client.prisma.publication.count({ where });

    return { offset, limit, total: totalUserPublications, results: simplifiedPublications };
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
