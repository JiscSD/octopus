import * as I from 'interface';

import prisma from 'lib/client';

export const getAll = async (filters: I.PublicationFilters) => {
    console.log(filters);
    const publications = await prisma.publication.findMany({
        take: Number(filters.limit) || 10,
        skip: Number(filters.offset) || 0,
        orderBy: {
            [filters.orderBy || 'updatedAt']: filters.orderDirection || 'desc'
        },
        where: {
            currentStatus: 'LIVE',
            OR: [
                {
                    title: {
                        contains: filters.search,
                        mode: 'insensitive'
                    }
                },
                {
                    content: {
                        contains: filters.search,
                        mode: 'insensitive'
                    }
                },
                {
                    user: {
                        firstName: {
                            contains: filters.search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    user: {
                        lastName: {
                            contains: filters.search,
                            mode: 'insensitive'
                        }
                    }
                }
            ]
        }
    });

    return publications;
};

export const get = async (id: string) => {
    const publication = await prisma.publication.findFirst({
        where: {
            id
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
            },
            linkedTo: {
                select: {
                    id: true,
                    publicationTo: true
                }
            },
            linkedFrom: {
                select: {
                    id: true,
                    publicationFrom: true
                }
            }
        }
    });

    return publication;
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

    return publication;
};

export const updateStatus = async (id: string, status: I.PublicationStatus) => {
    const updatedPublication = await prisma.publication.update({
        where: {
            id
        },
        data: {
            currentStatus: status,
            publicationStatus: {
                create: {
                    status
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

    return updatedPublication;
};
