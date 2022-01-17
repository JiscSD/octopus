import * as I from 'interface';

import prisma from 'lib/client';

export const getAll = async () => {
    // const publication = await prisma.publication.findFirst({
    //     where: {
    //     },
    //     include: {
    //         publicationStatus: {
    //             select: {
    //                 status: true,
    //                 createdAt: true,
    //                 id: true
    //             },
    //             orderBy: {
    //                 createdAt: 'desc'
    //             }
    //         }
    //     }
    // });

    // console.log(publication);

    // return publication;
};

export const create = async (e: I.CreatePublicationRequestBody, user: I.User) => {
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
            publicationStatus: {
                create: {
                    status: 'DRAFT'
                }
            }
        },
        include: {
            publicationStatus: {
                select: {
                    status: true,
                    createdAt: true,
                    id: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            }
        }
    });

    console.log(publication);

    return publication;
};