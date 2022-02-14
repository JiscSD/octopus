import * as I from 'interface';

import prisma from 'lib/client';

export const getAll = async (filters: I.PublicationFilters) => {
    const query = {
        where: {
            type: {
                in: (filters.type.split(',') as I.ProblemTypes) || [
                    'PROBLEM',
                    'PROTOCOL',
                    'ANALYSIS',
                    'REAL_WORLD_APPLICATION',
                    'HYPOTHESIS',
                    'DATA',
                    'INTERPRETATION',
                    'PEER_REVIEW'
                ]
            },
            currentStatus: 'LIVE'
        }
    };

    if (filters.search) {
        // @ts-ignore
        query.where.OR = [
            {
                title: {
                    search: filters.search?.replace(/ /gi, '|')
                }
            },
            {
                content: {
                    search: filters.search?.replace(/ /gi, '|')
                }
            },
            {
                user: {
                    firstName: {
                        search: filters.search?.replace(/ /gi, '|')
                    }
                }
            },
            {
                user: {
                    lastName: {
                        search: filters.search?.replace(/ /gi, '|')
                    }
                }
            }
        ];
    }

    // @ts-ignore
    const publications = await prisma.publication.findMany({
        ...query,
        orderBy: {
            [filters.orderBy || 'updatedAt']: filters.orderDirection || 'desc'
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    id: true
                }
            }
        },
        take: Number(filters.limit) || 10,
        skip: Number(filters.offset) || 0
    });

    // @ts-ignore
    const totalPublications = await prisma.publication.count(query);

    return {
        data: publications,
        metadata: {
            total: totalPublications,
            limit: Number(filters.limit) || 10,
            offset: Number(filters.offset) || 0
        }
    };
};

export const update = async (id: string, updateContent: I.UpdatePublicationRequestBody) => {
    const updatedPublication = await prisma.publication.update({
        where: {
            id
        },
        data: updateContent
    });

    return updatedPublication;
};

export const isIdInUse = async (id: string) => {
    const publication = await prisma.publication.count({
        where: {
            id
        }
    });

    return Boolean(publication);
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
            publicationFlags: {
                select: {
                    category: true,
                    comments: true,
                    createdBy: true,
                    id: true,
                    createdAt: true
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

export const createFlag = async (publication: string, user: string, category: I.FlagCategory, comments: string) => {
    const flag = await prisma.publicationFlags.create({
        data: {
            comments,
            category,
            user: {
                connect: {
                    id: user
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
