import * as client from 'lib/client';
import * as I from 'interface';
import { Prisma } from '@prisma/client';

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
export const getByUserID = async (
    id: string,
    options: { limit: number; offset: number; includeResolved?: boolean }
) => {
    const where: Prisma.PublicationFlagsWhereInput = {
        user: {
            id
        },
        ...(options.includeResolved ? {} : { resolved: false })
    };

    const [flags, total] = await Promise.all([
        client.prisma.publicationFlags.findMany({
            where,
            select: {
                id: true,
                category: true,
                resolved: true,
                createdAt: true,
                publication: {
                    select: {
                        id: true,
                        type: true,
                        versions: {
                            where: {
                                isLatestLiveVersion: true
                            },
                            select: {
                                coAuthors: {
                                    select: {
                                        user: {
                                            select: {
                                                firstName: true,
                                                lastName: true
                                            }
                                        }
                                    }
                                },
                                content: true,
                                description: true,
                                publishedDate: true,
                                title: true
                            }
                        }
                    }
                }
            },
            take: options.limit,
            skip: options.offset,
            orderBy: {
                createdAt: 'desc'
            }
        }),
        client.prisma.publicationFlags.count({ where })
    ]);

    return {
        data: flags,
        metadata: {
            total,
            limit: options.limit,
            offset: options.offset
        }
    };
};

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
