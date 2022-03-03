import prisma from 'lib/client';

import * as I from 'interface';

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
    const users = await prisma.user.findMany({
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
    const totalUsers = await prisma.user.count(query);

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
    const user = await prisma.user.findFirst({
        where: {
            apiKey
        }
    });

    return user;
};

export const get = async (id: string) => {
    const user = await prisma.user.findFirst({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            orcid: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
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
        },
        where: {
            id
        }
    });

    return user;
};
