import * as client from 'lib/client';
import * as I from 'interface';

export const get = (id: string) =>
    client.prisma.publicationFlags.findFirst({
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

export const getByPublicationID = (id: string) =>
    client.prisma.publicationFlags.findMany({
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

/**
 * This gets the flags created by a user
 * keeping as this can be useful for profile pages
 */
export const getByUserID = (id: string) =>
    client.prisma.publicationFlags.findMany({
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

export const createFlag = (
    publication: string,
    user: string,
    category: I.PublicationFlagCategoryEnum,
    comment: string
) =>
    client.prisma.publicationFlags.create({
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

export const getFlag = (id: string) =>
    client.prisma.publicationFlags.findFirst({
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

export const createFlagComment = (id: string, comment: string, user: string) =>
    client.prisma.flagComments.create({
        data: {
            flagId: id,
            comment,
            createdBy: user
        }
    });

export const resolveFlag = (id: string) =>
    client.prisma.publicationFlags.update({
        where: {
            id
        },
        data: {
            resolved: true
        }
    });
