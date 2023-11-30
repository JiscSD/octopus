import * as client from 'lib/client';
import * as I from 'lib/interface';
import { createId } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';

export const get = (id: string) =>
    client.prisma.coAuthors.findUnique({
        where: {
            id
        }
    });

export const getAllByPublicationVersion = async (publicationVersionId: string) => {
    const coAuthors = await client.prisma.coAuthors.findMany({
        where: {
            publicationVersionId
        },
        select: {
            id: true,
            email: true,
            linkedUser: true,
            publicationVersionId: true,
            confirmedCoAuthor: true,
            approvalRequested: true,
            isIndependent: true,
            affiliations: true,
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
export const updateAll = async (publicationVersionId: string, authors: I.CoAuthor[]) => {
    const update = await client.prisma.$transaction(
        authors.map((author, index) =>
            client.prisma.coAuthors.upsert({
                where: {
                    publicationVersionId_email: { publicationVersionId, email: author.email }
                },
                create: {
                    email: author.email.toLowerCase(),
                    approvalRequested: false,
                    confirmedCoAuthor: false,
                    publicationVersionId,
                    position: index
                },
                update: {
                    position: index // don't update anything else
                }
            })
        )
    );

    return update;
};

export const deleteCoAuthor = async (id: string) => {
    const deleteCoAuthor = await client.prisma.coAuthors.delete({
        where: {
            id
        }
    });

    return deleteCoAuthor;
};

export const deleteCoAuthorByEmail = (publicationVersionId: string, email: string) =>
    client.prisma.coAuthors.delete({
        where: {
            publicationVersionId_email: { publicationVersionId, email }
        }
    });

export const linkUser = async (userId: string, publicationVersionId: string, email: string, code: string) => {
    const update = await client.prisma.coAuthors.updateMany({
        where: {
            publicationVersionId,
            email,
            code
        },
        data: {
            linkedUser: userId
        }
    });

    return update;
};

export const removeFromPublicationVersion = async (publicationVersionId: string, email: string, code: string) =>
    client.prisma.coAuthors.deleteMany({
        where: {
            publicationVersionId,
            email,
            code
        }
    });

export const updateConfirmation = async (publicationVersionId: string, userId: string, confirm: boolean) => {
    const updateCoAuthor = await client.prisma.coAuthors.updateMany({
        where: {
            publicationVersionId,
            linkedUser: userId
        },
        data: {
            confirmedCoAuthor: confirm
        }
    });

    return updateCoAuthor;
};

export const resetCoAuthors = async (publicationVersionId: string) => {
    const publicationVersion = await client.prisma.publicationVersion.findFirst({
        where: {
            id: publicationVersionId
        }
    });

    const resetCoAuthors = await client.prisma.coAuthors.updateMany({
        where: {
            publicationVersionId,
            NOT: {
                linkedUser: publicationVersion?.createdBy
            }
        },
        data: {
            confirmedCoAuthor: false,
            code: createId()
        }
    });

    return resetCoAuthors;
};

export const getPendingApprovalForPublicationVersion = async (publicationVersionId: string) => {
    const coAuthors = await client.prisma.coAuthors.findMany({
        where: {
            confirmedCoAuthor: false,
            approvalRequested: false,
            publicationVersionId
        },
        orderBy: {
            position: 'asc'
        }
    });

    return coAuthors;
};

export const updateRequestApprovalStatus = async (publicationVersionId: string, email: string) => {
    const coAuthors = await client.prisma.coAuthors.updateMany({
        where: {
            publicationVersionId,
            email
        },
        data: {
            approvalRequested: true
        }
    });

    return coAuthors;
};

export const createCorrespondingAuthor = (publicationVersion: I.PublicationVersion) =>
    client.prisma.coAuthors.create({
        data: {
            email: publicationVersion.user.email || '',
            publicationVersionId: publicationVersion.id || '',
            linkedUser: publicationVersion.createdBy,
            affiliations: [],
            isIndependent: true,
            approvalRequested: false,
            confirmedCoAuthor: true
        }
    });
