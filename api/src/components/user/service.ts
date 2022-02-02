import prisma from 'lib/client';

import * as I from 'interface';

export const getAll = async (filters: I.UserFilters) => {
    const query = {
        where: {
            firstName: {
                search: filters.search?.replace(/ /ig, '|')
            },
            lastName: {
                search: filters.search?.replace(/ /ig, '|')
            }
        }
    };

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
                    type: true
                },
                where: {
                    currentStatus: 'LIVE'
                }
            }
        }
    });

    const usersWithoutFirstName = users.map((user) => ({
        ...user,
        firstName: user.firstName[0]
    }))

    // @ts-ignore
    const totalUsers = await prisma.user.count(query);

    return { 
        data: usersWithoutFirstName,
        metadata: {
            total: 2,
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
}