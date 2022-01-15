import * as I from 'interface';

import { prisma } from 'lib/client';

export const getAll = async () => {
    const publications = await prisma.publication.findMany({});

    return publications;
};

export const create = async (e: I.CreatePublicationRequestBody, user: I.User) => {
    // create publication
    const publication = await prisma.publication.create({
        data: {
            title: e.title,
            type: e.type,
            content: e.content,
            user: {
                connect: {
                    id: user.id
                }
            },
            PublicationStatus: {
                create: {
                    status: 'DRAFT'
                }
            }
        }
    });

    return publication;
};