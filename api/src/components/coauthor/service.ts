import prisma from 'lib/client';

import * as I from 'interface';

export const create = async (e: I.CreateCoAuthorRequestBody, publicationId: string) => {
    const create = await prisma.coAuthors.create({
        data: {
            publicationId,
            email: e.email
        }
    });

    return create;
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
