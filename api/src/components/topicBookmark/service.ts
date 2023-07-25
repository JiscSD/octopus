import * as client from 'lib/client';

export const create = async (topicId: string, userId: string) => {
    const create = await client.prisma.topicBookmark.create({
        data: {
            topicId,
            userId
        },
        select: {
            id: true,
            topicId: true,
            userId: true
        }
    });

    return create;
};

export const get = async (topicId: string, userId: string) => {
    const bookmark = await client.prisma.topicBookmark.findFirst({
        where: {
            topicId,
            userId
        },
        select: {
            id: true,
            topicId: true,
            userId: true
        }
    });

    return bookmark;
};

export const remove = async (bookmarkId: string) => {
    const bookmark = await client.prisma.topicBookmark.delete({
        where: {
            id: bookmarkId
        }
    });

    return bookmark;
};

export const getAll = async (userId: string) => {
    const bookmark = await client.prisma.topicBookmark.findMany({
        where: {
            userId
        },
        select: {
            id: true,
            topicId: true,
            userId: true,
            topic: {
                select: {
                    id: true,
                    title: true,
                    language: true,
                    translations: {
                        select: {
                            language: true,
                            value: true
                        }
                    },
                    createdAt: true,
                    updatedAt: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return bookmark;
};
