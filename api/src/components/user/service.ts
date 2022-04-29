import * as client from 'lib/client';

import * as I from 'interface';

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
        update: {
            firstName: updateUserInformation.firstName,
            lastName: updateUserInformation.lastName,
            employment: updateUserInformation.employment,
            education: updateUserInformation.education,
            works: updateUserInformation.works
        },
        create: {
            firstName: updateUserInformation.firstName,
            lastName: updateUserInformation.lastName,
            employment: updateUserInformation.employment,
            education: updateUserInformation.education,
            orcid
        }
    });

    return user;
};

export const getAll = async (filters: I.UserFilters) => {
    const query = {};

    if (filters.search) {
        // @ts-ignore
        query.where = {
            firstName: {
                search: filters.search?.replace(/ /gi, '|')
            },
            lastName: {
                search: filters.search?.replace(/ /gi, '|')
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
            Publication: {
                select: {
                    id: true,
                    title: true,
                    type: true,
                    description: true,
                    keywords: true
                },
                where: {
                    currentStatus: 'LIVE'
                }
            }
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

export const get = async (id: string) => {
    const user = await client.prisma.user.findFirst({
        where: {
            id
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            orcid: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            employment: true,
            education: true,
            works: true,
            Publication: {
                select: {
                    id: true,
                    title: true,
                    type: true,
                    doi: true,
                    createdAt: true,
                    updatedAt: true,
                    publishedDate: true,
                    currentStatus: true,
                    description: true,
                    keywords: true,
                    url_slug: true,
                    licence: true,
                    content: true,
                    user: true
                },
                where: {
                    currentStatus: 'LIVE'
                }
            }
        }
    });

    return user;
};

export const getPublications = async (id: string, statuses: Array<I.ValidStatuses>) => {
    const userPublications = await client.prisma.user.findFirst({
        where: {
            id
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            orcid: true,
            createdAt: true,
            updatedAt: true,
            Publication: {
                where: {
                    currentStatus: {
                        in: statuses
                    }
                },
                select: {
                    id: true,
                    title: true,
                    type: true,
                    doi: true,
                    createdAt: true,
                    updatedAt: true,
                    publishedDate: true,
                    currentStatus: true,
                    url_slug: true,
                    licence: true,
                    content: true
                }
            }
        }
    });

    return userPublications;
};
