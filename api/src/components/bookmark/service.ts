import * as client from 'lib/client';

export const create = async (publicationId: string, userId: string) => {
    const create = await client.prisma.publicationBookmarks.create({
        data: {
            publicationId,
            userId
        },
        select: {
            id: true,
            publicationId: true,
            userId: true
        }
    });

    return create;
};

export const get = async (publicationId: string, userId: string) => {
    const bookmark = await client.prisma.publicationBookmarks.findFirst({
        where: {
            publicationId,
            userId
        },
        select: {
            id: true,
            publicationId: true,
            userId: true
        }
    });

    return bookmark;
};

export const remove = async (bookmarkId: string) => {
    const bookmark = await client.prisma.publicationBookmarks.delete({
        where: {
            id: bookmarkId
        }
    });

    return bookmark;
};

export const getAll = async (userId: string) => {
    const bookmark = await client.prisma.publicationBookmarks.findMany({
        where: {
            userId
        },
        select: {
            id: true,
            publicationId: true,
            userId: true,
            publication: {
                select: {
                    title: true,
                    createdAt: true,
                    currentStatus: true,
                    url_slug: true,
                    description: true,
                    type: true,
                    publishedDate: true,
                    coAuthors: {
                        select: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    id: true
                                }
                            }
                        }
                    },
                    doi: true,
                    updatedAt: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return bookmark;
};
