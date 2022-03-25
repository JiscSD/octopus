import prisma from 'lib/client';
import cuid from 'cuid';

import * as I from 'interface';

export const create = async (e: I.CreateCoAuthorRequestBody, publicationId: string) => {
    const create = await prisma.coAuthors.create({
        data: {
            publicationId,
            email: e.email
        },
        select: {
            id: true,
            publicationId: true,
            email: true,
            linkedUser: true,
            confirmedCoAuthor: true
        }
    });

    return create;
};

export const deleteCoAuthor = async (id: string) => {
    const deleteCoAuthor = await prisma.coAuthors.delete({
        where: {
            id
        }
    });

    return deleteCoAuthor;
};

export const resendCoAuthor = async (id: string) => {
    const resendCoAuthor = await prisma.coAuthors.update({
        where: {
            id
        },
        data: {
            code: cuid()
        }
    });

    return resendCoAuthor;
};

export const confirmCoAuthor = async (userId: string, email: string, code: string) => {
    const resendCoAuthor = await prisma.coAuthors.updateMany({
        // updateMany so both email and code can be confirmed.
        where: {
            email,
            code
        },
        data: {
            confirmedCoAuthor: true,
            linkedUser: userId
        }
    });

    return resendCoAuthor;
};

export const isUserAlreadyCoAuthor = async (e: I.CreateCoAuthorRequestBody, publicationId: string) => {
    const publication = await prisma.coAuthors.count({
        where: {
            email: {
                contains: e.email
            },
            publicationId: {
                contains: publicationId
            }
        }
    });

    return Boolean(publication);
};
