import * as client from 'lib/client';

// create a service that actually records the bookmark in the db

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
        include: {
            id: true,
            publicationId: true,
            userId: true
        }
    });

    return bookmark;
};

// create a service that actually deletes the record of the bookmark on the db
export const remove = async (publicationId: string, userId: string) => {
    const bookmark = await client.prisma.publicationBookmarks.delete({
        where: {
            publicationId,
            userId
        }
    });

    return bookmark;
};
