import * as client from 'lib/client';
import * as I from 'interface';

export const get = async (id: string) => {
    const flags = await client.prisma.publicationFlags.findFirst({
        include: {
            user: {
                select: {
                    id: true,
                    orcid: true,
                    firstName: true,
                    lastName: true,
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

export const createFlag = async (
    publication: string,
    user: string,
    category: I.PublicationFlagCategoryEnum,
    comment: string
) => {
    const flag = await client.prisma.publicationFlags.create({
        data: {
            category,
            user: {
                connect: {
                    id: user
                }
            },
            flagComments: {
                create: {
                    comment,
                    createdBy: user
                }
            },
            publication: {
                connect: {
                    id: publication
                }
            }
        }
    });

    return flag;
};

export const getFlag = async (id: string) => {
    const flag = await client.prisma.publicationFlags.findFirst({
        where: {
            id
        },
        include: {
            publication: {
                include: {
                    versions: {
                        include: {
                            user: true
                        }
                    }
                }
            }
        }
    });

    return flag;
};

export const createFlagComment = async (id: string, comment: string, user: string) => {
    const flagComment = await client.prisma.flagComments.create({
        data: {
            flagId: id,
            comment,
            createdBy: user
        }
    });

    return flagComment;
};

export const resolveFlag = async (id: string) => {
    const resolveFlag = await client.prisma.publicationFlags.update({
        where: {
            id
        },
        data: {
            resolved: true
        }
    });

    return resolveFlag;
};
