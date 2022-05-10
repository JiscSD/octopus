import * as client from 'lib/client';

export const getByPublicationID = async (id: string) => {
    const flags = await client.prisma.publicationFlags.findMany({
        include: {
            flagComments: true
        },
        where: {
            publicationId: id
        }
    });

    return flags;
};

export const getByUserID = async (id: string) => {
    // this gets the flags created by a user
    // keeping as this can be useful for profile pages
    const flags = await client.prisma.publicationFlags.findMany({
        include: {
            flagComments: true
        },
        where: {
            user: {
                id
            }
        }
    });

    return flags;
};

export const get = async (id: string) => {
    const link = await client.prisma.links.findFirst({
        include: {
            publicationFromRef: {
                select: {
                    id: true,
                    user: true,
                    currentStatus: true,
                    publicationStatus: true
                }
            },
            publicationToRef: {
                select: {
                    id: true,
                    user: true,
                    currentStatus: true,
                    publicationStatus: true
                }
            }
        },
        where: {
            id
        }
    });

    return link;
};
