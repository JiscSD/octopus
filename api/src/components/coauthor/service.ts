import * as client from 'lib/client';
import cuid from 'cuid';

export const create = async (email: string, publicationId: string) => {
    const create = await client.prisma.coAuthors.create({
        data: {
            publicationId,
            email
        },
        select: {
            id: true,
            publicationId: true,
            email: true,
            linkedUser: true,
            confirmedCoAuthor: true,
            code: true
        }
    });

    return create;
};

export const deleteCoAuthor = async (id: string) => {
    const deleteCoAuthor = await client.prisma.coAuthors.delete({
        where: {
            id
        }
    });

    return deleteCoAuthor;
};

export const resendCoAuthor = async (id: string) => {
    const resendCoAuthor = await client.prisma.coAuthors.update({
        where: {
            id
        },
        data: {
            code: cuid()
        }
    });

    return resendCoAuthor;
};

export const confirmCoAuthor = async (userId: string, publicationId: string, email: string, code: string) => {
    const confirmCoAuthor = await client.prisma.coAuthors.updateMany({
        where: {
            publicationId,
            email,
            code
        },
        data: {
            linkedUser: userId
        }
    });

    return confirmCoAuthor.count;
};

export const denyCoAuthor = async (publicationId: string, email: string, code: string) => {
    const denyCoAuthor = await client.prisma.coAuthors.deleteMany({
        where: {
            publicationId,
            email,
            code
        }
    });

    return denyCoAuthor.count;
};

export const updateCoAuthor = async (publicationId: string, userId: string, confirm: boolean) => {
    const updateCoAuthor = await client.prisma.coAuthors.updateMany({
        where: {
            publicationId,
            linkedUser: userId
        },
        data: {
            confirmedCoAuthor: confirm
        }
    });
    return updateCoAuthor;
};

export const resetCoAuthors = async (publicationId: string) => {
    const resetCoAuthors = await client.prisma.coAuthors.updateMany({
        where: {
            publicationId
        },
        data: {
            confirmedCoAuthor: false,
            code: cuid()
        }
    });
    return resetCoAuthors;
};

export const isUserAlreadyCoAuthor = async (email: string, publicationId: string) => {
    const publication = await client.prisma.coAuthors.count({
        where: {
            email: email,
            publicationId
        }
    });

    return Boolean(publication);
};
