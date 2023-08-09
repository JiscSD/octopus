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

export const getAll = async (userId: string, type: I.BookmarkType | undefined) => {
    const bookmark = await client.prisma.bookmark.findMany({
        where: type
            ? {
                  type,
                  userId
              }
            : { userId },
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

    return bookmark;
};
