import * as client from 'lib/client';

export const get = async (id: string) => {
    const flags = await client.prisma.publicationFlags.findFirst({
        include: {
            user: {
                select: {
                    id: true,
                    orcid: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            flagComments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            orcid: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                }
            }
        },
        where: {
            id
        }
    });

    return flags;
};

export const getByPublicationID = async (id: string) => {
    const flags = await client.prisma.publicationFlags.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    orcid: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            flagComments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            orcid: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                }
            }
        },
        where: {
            publicationId: id
        }
    });

    return flags;
};

/**
 * This gets the flags created by a user
 * keeping as this can be useful for profile pages
 */
export const getByUserID = async (id: string) => {
    const flags = await client.prisma.publicationFlags.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    orcid: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            flagComments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            orcid: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                }
            }
        },
        where: {
            user: {
                id
            }
        }
    });

    return flags;
};
