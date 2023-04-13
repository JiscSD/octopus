import * as client from 'lib/client';
import * as I from 'lib/interface';
import cuid from 'cuid';
import { Prisma } from '@prisma/client';

export const get = (id: string) =>
    client.prisma.coAuthors.findUnique({
        where: {
            id
        }
    });

export const getAllByPublication = async (publicationId: string) => {
    const coAuthors = await client.prisma.coAuthors.findMany({
        where: {
            publicationId
        },
        select: {
            id: true,
            email: true,
            linkedUser: true,
            publicationId: true,
            confirmedCoAuthor: true,
            approvalRequested: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    orcid: true
                }
            }
        },
        orderBy: {
            position: 'asc'
        }
    });

    return coAuthors;
};

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

export const update = (id: string, data: Prisma.CoAuthorsUpdateInput) =>
    client.prisma.coAuthors.update({
        where: {
            id
        },
        data
    });

/**
 *
 * @Important
 *
 * onUpdate - only update the 'position' of authors, don't take any other user input
 * onCreate - don't take user input for fields like: confirmedCoAuthor, approvalRequested or linkedUser
 *
 */
export const updateAll = (publicationId: string, authors: I.CoAuthor[]) =>
    client.prisma.$transaction(
        authors.map((author, index) =>
            client.prisma.coAuthors.upsert({
                where: {
                    publicationId_email: { publicationId, email: author.email }
                },
                create: {
                    email: author.email,
                    approvalRequested: false,
                    confirmedCoAuthor: false,
                    publicationId,
                    position: index
                },
                update: {
                    position: index // don't update anything else
                }
            })
        )
    );

export const deleteCoAuthor = async (id: string) => {
    const deleteCoAuthor = await client.prisma.coAuthors.delete({
        where: {
            id
        }
    });

    return deleteCoAuthor;
};

export const deleteCoAuthorByEmail = (publicationId: string, email: string) =>
    client.prisma.coAuthors.delete({
        where: {
            publicationId_email: { publicationId, email }
        }
    });

export const linkUser = (userId: string, publicationId: string, email: string, code: string) =>
    client.prisma.coAuthors.updateMany({
        where: {
            publicationId,
            email,
            code
        },
        data: {
            linkedUser: userId
        }
    });

export const removeFromPublication = async (publicationId: string, email: string, code: string) =>
    client.prisma.coAuthors.deleteMany({
        where: {
            publicationId,
            email,
            code
        }
    });

export const updateConfirmation = async (publicationId: string, userId: string, confirm: boolean) => {
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
    const publication = await client.prisma.publication.findFirst({
        where: {
            id: publicationId
        }
    });

    const resetCoAuthors = await client.prisma.coAuthors.updateMany({
        where: {
            publicationId,
            NOT: {
                linkedUser: publication?.createdBy
            }
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

export const getPendingApprovalForPublication = async (publicationId: string) => {
    const coAuthors = await client.prisma.coAuthors.findMany({
        where: {
            confirmedCoAuthor: false,
            approvalRequested: false,
            publicationId
        },
        orderBy: {
            position: 'asc'
        }
    });

    return coAuthors;
};

export const updateRequestApprovalStatus = async (publicationId: string, email: string) => {
    const coAuthors = await client.prisma.coAuthors.updateMany({
        where: {
            publicationId,
            email
        },
        data: {
            approvalRequested: true
        }
    });

    return coAuthors;
};
