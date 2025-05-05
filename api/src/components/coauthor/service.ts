import * as client from 'lib/client';
import * as I from 'lib/interface';
import * as publicationVersionService from 'publicationVersion/service';
import { createId } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';

export const get = (id: string) =>
    client.prisma.coAuthors.findUnique({
        where: {
            id
        }
    });

export const getAllByPublicationVersion = (publicationVersionId: string) =>
    client.prisma.coAuthors.findMany({
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

export const update = async (id: string, data: Prisma.CoAuthorsUpdateInput) => {
    const updateCoAuthor = await client.prisma.coAuthors.update({
        where: {
            id
        },
        data
    });

    await publicationVersionService.update(updateCoAuthor.publicationVersionId, {
        updatedAt: new Date().toISOString()
    });

    return updateCoAuthor;
};

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
                    publicationVersionId,
                    position: index
                },
                update: {
                    position: index // don't update anything else
                }
            })
        )
    );

    await publicationVersionService.update(publicationVersionId, {
        updatedAt: new Date().toISOString()
    });

    return update;
};

export const deleteCoAuthor = async (id: string) => {
    const coAuthor = await client.prisma.coAuthors.findFirst({
        where: {
            id
        },
        select: {
            publicationVersionId: true
        }
    });
    const deleteCoAuthor = await client.prisma.coAuthors.delete({
        where: {
            id
        }
    });

    if (coAuthor) {
        await publicationVersionService.update(coAuthor.publicationVersionId, {
            updatedAt: new Date().toISOString()
        });
    }

    return deleteCoAuthor;
};

export const deleteCoAuthorByEmail = async (publicationVersionId: string, email: string) => {
    const deleteCoAuthor = await client.prisma.coAuthors.delete({
        where: {
            publicationVersionId_email: { publicationVersionId, email }
        }
    });

    await publicationVersionService.update(publicationVersionId, {
        updatedAt: new Date().toISOString()
    });

    return deleteCoAuthor;
};

export const linkUser = async (userId: string, publicationVersionId: string, email: string) => {
    const update = await client.prisma.coAuthors.updateMany({
        where: {
            publicationVersionId,
            email
        },
        data: {
            linkedUser: userId
        }
    });
    await publicationVersionService.update(publicationVersionId, {
        updatedAt: new Date().toISOString()
    });

    return update;
};

export const removeFromPublicationVersion = async (publicationVersionId: string, email: string) => {
    const removeCoAuthor = client.prisma.coAuthors.deleteMany({
        where: {
            publicationVersionId,
            email
        }
    });
    await publicationVersionService.update(publicationVersionId, {
        updatedAt: new Date().toISOString()
    });

    return removeCoAuthor;
};

export const updateConfirmation = async (
    publicationVersionId: string,
    userId: string,
    confirm: boolean,
    retainApproval: boolean
) => {
    const updateCoAuthor = await client.prisma.coAuthors.updateMany({
        where: {
            publicationVersionId,
            linkedUser: userId
        },
        data: {
            confirmedCoAuthor: confirm,
            retainApproval
        }
    });
    await publicationVersionService.update(publicationVersionId, {
        updatedAt: new Date().toISOString()
    });

    return updateCoAuthor;
};

export const resetCoAuthors = async (publicationVersionId: string) => {
    const publicationVersion = await client.prisma.publicationVersion.findFirst({
        where: {
            id: publicationVersionId
        },
        select: {
            createdBy: true
        }
    });

    const resetCoAuthors = await client.prisma.coAuthors.updateMany({
        where: {
            publicationVersionId,
            NOT: {
                OR: [{ linkedUser: publicationVersion?.createdBy }, { retainApproval: true }]
            }
        },
        data: {
            confirmedCoAuthor: false,
            code: createId()
        }
    });
    await publicationVersionService.update(publicationVersionId, {
        updatedAt: new Date().toISOString()
    });

    return resetCoAuthors;
};

export const getPendingApprovalForPublicationVersion = (publicationVersionId: string) =>
    client.prisma.coAuthors.findMany({
        where: {
            confirmedCoAuthor: false,
            approvalRequested: false,
            publicationVersionId
        },
        orderBy: {
            position: 'asc'
        }
    });

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
    await publicationVersionService.update(publicationVersionId, {
        updatedAt: new Date().toISOString()
    });

    return coAuthors;
};

export const createCorrespondingCoAuthor = async (publicationVersion: I.PrivatePublicationVersion) => {
    const create = client.prisma.coAuthors.create({
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
    await publicationVersionService.update(publicationVersion.id, {
        updatedAt: new Date().toISOString()
    });

    return create;
};
