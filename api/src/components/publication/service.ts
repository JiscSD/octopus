import * as client from 'lib/client';

import * as I from 'interface';

export const getAllByIds = async (ids: Array<string>) => {
    const publications = await client.prisma.publication.findMany({
        where: {
            id: {
                in: ids
            }
        },
        include: {
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                    id: true,
                    orcid: true
                }
            }
        }
    });

    return publications;
};

export const update = async (id: string, updateContent: I.UpdatePublicationRequestBody) => {
    const updatedPublication = await client.prisma.publication.update({
        where: {
            id
        },
        data: updateContent
    });

    return updatedPublication;
};

export const isIdInUse = async (id: string) => {
    const publication = await client.prisma.publication.count({
        where: {
            id
        }
    });

    return Boolean(publication);
};
export const get = async (id: string) => {
    const publication = await client.prisma.publication.findFirst({
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
            coAuthors: {
                select: {
                    id: true,
                    linkedUser: true
                }
            },
            linkedTo: {
                where: {
                    publicationToRef: {
                        currentStatus: 'LIVE'
                    }
                },
                select: {
                    id: true,
                    publicationToRef: {
                        select: {
                            id: true,
                            title: true,
                            publishedDate: true,
                            currentStatus: true,
                            description: true,
                            keywords: true,
                            type: true,
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    orcid: true
                                }
                            }
                        }
                    }
                }
            },
            linkedFrom: {
                where: {
                    publicationFromRef: {
                        currentStatus: 'LIVE'
                    }
                },
                select: {
                    id: true,
                    publicationFromRef: {
                        select: {
                            id: true,
                            title: true,
                            publishedDate: true,
                            currentStatus: true,
                            description: true,
                            keywords: true,
                            type: true,
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    orcid: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return publication;
};

export const deletePublication = async (id: string) => {
    const deletedPublication = await client.prisma.publication.delete({
        where: {
            id
        }
    });

    return deletedPublication;
};

export const createOpenSearchRecord = async (data: I.OpenSearchPublication) => {
    const publication = await client.search.create({
        index: 'publications',
        id: data.id,
        body: data
    });

    return publication;
};

export const getOpenSearchRecords = async (filters: I.PublicationFilters) => {
    const query = {
        index: 'publications',
        body: {
            from: filters.offset,
            size: filters.limit,
            sort: ['_score'],
            query: {
                bool: {
                    filter: {
                        terms: {
                            type: (filters.type
                                .split(',')
                                .map((type) => type.toLowerCase()) as I.PublicationType[]) || [
                                'problem',
                                'protocol',
                                'analysis',
                                'real_world_application',
                                'hypothesis',
                                'data',
                                'interpretation',
                                'peer_review'
                            ],
                            _name: 'type'
                        }
                    }
                }
            }
        }
    };

    if (filters.search) {
        // @ts-ignore
        query.body.query.bool.must = {
            multi_match: {
                query: filters.search,
                fuzziness: 'auto',
                type: 'most_fields',
                operator: 'or',
                fields: ['title^3', 'cleanContent', 'keywords^2', 'description^2'] // include author full names, DOI field, content below author & title
            }
        };
    }

    if (filters.exclude) {
        // @ts-ignore
        query.body.query.bool.must_not = {
            terms: {
                _id: filters.exclude.split(',')
            }
        };
    }

    const publications = await client.search.search(query);

    return publications;
};

export const create = async (e: I.CreatePublicationRequestBody, user: I.User) => {
    const publication = await client.prisma.publication.create({
        data: {
            title: e.title,
            type: e.type,
            licence: e.licence,
            description: e.description,
            keywords: e.keywords,
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

export const updateStatus = async (id: string, status: I.PublicationStatusEnum, isReadyToPublish: boolean) => {
    const query = {
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
    };

    if (isReadyToPublish) {
        // @ts-ignore
        query.data.publishedDate = new Date().toISOString();
    }

    // @ts-ignore
    const updatedPublication = await client.prisma.publication.update(query);

    return updatedPublication;
};

export const createFlag = async (
    publication: string,
    user: string,
    category: I.PublicationFlagCategoryEnum,
    comments: string
) => {
    const flag = await client.prisma.publicationFlags.create({
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

export const validateConflictOfInterest = (publication: I.Publication) => {
    if (publication.conflictOfInterestStatus) {
        if (!publication.conflictOfInterestText?.length) return false;
    }

    return true;
};

export const isPublicationReadyToPublish = (publication: I.Publication, status: string) => {
    let isReady = false;

    // @ts-ignore This needs looking at, type mismatch between infered type from get method to what Prisma has
    const hasAtLeastOneLinkTo = publication.linkedTo.length !== 0;
    const hasAllFields = ['title', 'content', 'licence'].every((field) => publication[field]);
    const conflictOfInterest = validateConflictOfInterest(publication);
    const hasPublishDate = Boolean(publication.publishedDate);

    const isAttemptToLive = status === 'LIVE';

    // More external checks can be chained here for the future
    if (hasAtLeastOneLinkTo && hasAllFields && conflictOfInterest && !hasPublishDate && isAttemptToLive) isReady = true;

    return isReady;
};
