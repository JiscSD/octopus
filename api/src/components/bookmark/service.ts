import * as client from 'lib/client';
import * as I from 'interface';

export const create = (type: I.BookmarkType, entityId: string, userId: string) =>
    client.prisma.bookmark.create({
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

export const get = (id: string) =>
    client.prisma.bookmark.findUnique({
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

export const getByFields = (type: I.BookmarkType, entityId: string, userId: string) =>
    client.prisma.bookmark.findFirst({
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

export const deleteBookmark = (id: string) =>
    client.prisma.bookmark.delete({
        where: {
            id
        }
    });

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
                            type: true,
                            doi: true,
                            versions: {
                                where: {
                                    isLatestVersion: true
                                },
                                select: {
                                    publishedDate: true,
                                    createdAt: true,
                                    updatedAt: true,
                                    title: true,
                                    user: {
                                        select: {
                                            firstName: true,
                                            lastName: true
                                        }
                                    },
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
