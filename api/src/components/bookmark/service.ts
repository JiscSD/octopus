import * as client from 'lib/client';
import * as I from 'interface';

export const create = async (type: I.BookmarkType, entityId: string, userId: string) => {
    const create = await client.prisma.bookmark.create({
        data: {
            type,
            entityId,
            userId
        },
        select: {
            id: true,
            type: true,
            entityId: true,
            userId: true
        }
    });

    return create;
};

export const get = async (id: string) => {
    const bookmark = await client.prisma.bookmark.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            type: true,
            entityId: true,
            userId: true
        }
    });

    return bookmark;
};

export const getByFields = async (type: I.BookmarkType, entityId: string, userId: string) => {
    const bookmark = await client.prisma.bookmark.findFirst({
        where: {
            type,
            entityId,
            userId
        },
        select: {
            id: true,
            type: true,
            entityId: true,
            userId: true
        }
    });

    return bookmark;
};

export const deleteBookmark = async (id: string) => {
    const bookmark = await client.prisma.bookmark.delete({
        where: {
            id
        }
    });

    return bookmark;
};

export const getMany = async (
    userId: string,
    type: I.BookmarkType,
    entityId?: string
): Promise<I.PopulatedBookmark[]> => {
    const bookmarks = await client.prisma.bookmark.findMany({
        where: {
            type,
            userId,
            ...(entityId && { entityId })
        },
        select: {
            id: true,
            type: true,
            entityId: true,
            userId: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const populatedBookmarks: I.PopulatedBookmark[] = [];

    // Populate entity. Has to be done with a separate query because the
    // relationship is not enforced in prisma.
    await Promise.all(
        bookmarks.map(async (bookmark, idx) => {
            switch (bookmark.type) {
                case 'PUBLICATION': {
                    const entity = await client.prisma.publication.findUnique({
                        where: {
                            id: bookmark.entityId
                        },
                        select: {
                            id: true,
                            createdAt: true,
                            type: true,
                            doi: true,
                            updatedAt: true,
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true
                                }
                            },
                            versions: {
                                where: {
                                    isCurrent: true
                                },
                                select: {
                                    publishedDate: true,
                                    title: true,
                                    coAuthors: {
                                        select: {
                                            user: {
                                                select: {
                                                    firstName: true,
                                                    lastName: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });

                    if (entity) {
                        // Put data from latest version into entity
                        const { versions, ...entityRest } = entity;
                        const entityWithData = {
                            ...entityRest,
                            ...versions[0]
                        };
                        populatedBookmarks[idx] = { ...bookmarks[idx], entity: entityWithData };
                    }

                    break;
                }

                case 'TOPIC': {
                    const entity = await client.prisma.topic.findUnique({
                        where: {
                            id: bookmark.entityId
                        },
                        select: {
                            id: true,
                            title: true
                        }
                    });

                    if (entity) {
                        populatedBookmarks[idx] = { ...bookmarks[idx], entity };
                    }

                    break;
                }
            }
        })
    );

    return populatedBookmarks;
};
