import * as I from 'interface';
import * as client from 'lib/client';

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
                    id: true,
                    category: true,
                    resolved: true,
                    createdBy: true,
                    createdAt: true,
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
            },
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
            funders: {
                select: {
                    id: true,
                    city: true,
                    country: true,
                    name: true,
                    link: true,
                    ror: true
                }
            },
            affiliations: {
                select: {
                    id: true,
                    city: true,
                    country: true,
                    name: true,
                    link: true,
                    ror: true
                }
            },
            coAuthors: {
                select: {
                    id: true,
                    email: true,
                    linkedUser: true,
                    publicationId: true,
                    confirmedCoAuthor: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            orcid: true
                        }
                    }
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
                            doi: true,
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
                            doi: true,
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

export const getSeedDataPublications = async (title: string) => {
    const publications = await client.prisma.publication.findMany({
        where: {
            createdBy: 'octopus',
            title
        },
        include: {
            linkedTo: {
                where: {
                    publicationToRef: {
                        currentStatus: 'LIVE'
                    }
                },
                select: {
                    id: true,
                    publicationTo: true
                }
            }
        }
    });

    return publications;
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
    const orderBy = filters.orderBy
        ? {
              [filters.orderBy]: {
                  order: filters.orderDirection || 'asc'
              }
          }
        : null;

    const query = {
        index: 'publications',
        body: {
            from: filters.offset,
            size: filters.limit,
            sort: [orderBy || '_score'],
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

    const must: any[] = [];

    if (filters.search) {
        // @ts-ignore
        must.push({
            multi_match: {
                query: filters.search,
                fuzziness: 'auto',
                type: 'most_fields',
                operator: 'or',
                fields: ['title^3', 'cleanContent', 'keywords^2', 'description^2'] // include author full names, DOI field, content below author & title
            }
        });
    }

    if (filters.dateFrom || filters.dateTo) {
        must.push({
            range: {
                publishedDate: {
                    gte: filters.dateFrom,
                    lte: filters.dateTo
                }
            }
        });
    }

    // @ts-ignore
    query.body.query.bool.must = must;

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

export const create = async (e: I.CreatePublicationRequestBody, user: I.User, doiResponse: I.DOIResponse) => {
    const publication = await client.prisma.publication.create({
        data: {
            id: doiResponse.data.attributes.suffix,
            doi: doiResponse.data.attributes.doi,
            title: e.title,
            type: e.type,
            licence: e.licence,
            description: e.description,
            keywords: e.keywords,
            content: e.content,
            language: e.language,
            ethicalStatement: e.ethicalStatement,
            ethicalStatementFreeText: e.ethicalStatementFreeText,
            dataPermissionsStatement: e.dataPermissionsStatement,
            dataPermissionsStatementProvidedBy: e.dataPermissionsStatementProvidedBy,
            dataAccessStatement: e.dataAccessStatement,
            selfDeclaration: e.selfDeclaration,
            fundersStatement: e.fundersStatement,
            affiliationStatement: e.affiliationStatement,
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

export const validateConflictOfInterest = (publication: I.Publication) => {
    if (publication.conflictOfInterestStatus) {
        if (!publication.conflictOfInterestText?.length) return false;
    }

    return true;
};

export const doesDuplicateFlagExist = async (publication, category, user) => {
    const flag = await client.prisma.publicationFlags.findFirst({
        where: {
            publicationId: publication,
            createdBy: user,
            category,
            resolved: false
        }
    });

    return flag;
};

export const isPublicationReadyToPublish = (publication: I.PublicationWithMetadata, status: string) => {
    if (!publication) {
        return false;
    }

    let isReady = false;

    // @ts-ignore This needs looking at, type mismatch between inferred type from get method to what Prisma has
    const hasAtLeastOneLinkTo = publication.linkedTo.length !== 0;
    const hasAllFields = ['title', 'content', 'licence'].every((field) => publication[field]);
    const conflictOfInterest = validateConflictOfInterest(publication);
    const hasPublishDate = Boolean(publication.publishedDate);
    const isDataAndHasEthicalStatement = publication.type === 'DATA' ? publication.ethicalStatement !== null : true;
    const isDataAndHasPermissionsStatement =
        publication.type === 'DATA' ? publication.dataPermissionsStatement !== null : true;
    const coAuthorsAreVerified = publication.coAuthors.every((coAuthor) => coAuthor.confirmedCoAuthor);

    const isAttemptToLive = status === 'LIVE';

    // More external checks can be chained here for the future
    if (
        hasAtLeastOneLinkTo &&
        hasAllFields &&
        conflictOfInterest &&
        !hasPublishDate &&
        isDataAndHasEthicalStatement &&
        isDataAndHasPermissionsStatement &&
        coAuthorsAreVerified &&
        isAttemptToLive
    ) {
        isReady = true;
    }

    return isReady;
};

export const getLinksForPublication = async (id: string) => {
    const rootPublication = await get(id);

    /*
     * This set of queries provides two result sets:
     *
     * "linkedToPublications" refers to publications to the left of the publication chain.
     * "linkedFromPublications" refers to publications that follow to the right of the publication chain.
     *
     * The basic function of each query is to recursively select linked publications in each individual direction of the chain.
     * This can then be used to generate a tree representation branching from a root publication.
     *
     * Additional rules:
     *
     * 1. Only LIVE publications are returned.
     * 2. To limit the tree size, a linked publication cannot be of the same type (for instance, we aren't looking to return problems linked to other problems)
     */

    const linkedToPublications = await client.prisma.$queryRaw`
        WITH RECURSIVE to_left AS (
            SELECT "Links"."publicationFrom",
                   "Links"."publicationTo",
                   "pfrom".type "publicationFromType",
                   "pto".type "publicationToType",
                   "pto".title "publicationToTitle",
                   "pto"."publishedDate" "publicationToPublishedDate",
                   "pto"."currentStatus" "publicationToCurrentStatus",
                   "pto_user"."firstName" "publicationToFirstName",
                   "pto_user"."lastName" "publicationToLastName"

              FROM "Links"
              LEFT JOIN "Publication" AS pfrom
              ON "pfrom".id = "Links"."publicationFrom"

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "Links"."publicationTo"

              LEFT JOIN "User" AS pto_user
              ON "pto"."createdBy" = "pto_user"."id"

            WHERE "Links"."publicationFrom" = ${id}

            UNION ALL

            SELECT l."publicationFrom",
                   l."publicationTo",
                   "pfrom".type "publicationFromType",
                   "pto".type "publicationToType",
                   "pto".title "publicationToTitle",
                   "pto"."publishedDate" "publicationToPublishedDate",
                   "pto"."currentStatus" "publicationToCurrentStatus",
                   "pto_user"."firstName" "publicationToFirstName",
                   "pto_user"."lastName" "publicationToLastName"
              FROM "Links" l
              JOIN to_left
              ON to_left."publicationTo" = l."publicationFrom"

              LEFT JOIN "Publication" AS pfrom
              ON "pfrom".id = "l"."publicationFrom"

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "l"."publicationTo"

              LEFT JOIN "User" AS pto_user
              ON "pto"."createdBy" = "pto_user"."id"
        )
        SELECT *
          FROM to_left
         WHERE "publicationToType" != "publicationFromType"
           AND "publicationToType" != ${rootPublication?.type}
           AND "publicationToCurrentStatus" = 'LIVE';
    `;

    const linkedFromPublications = await client.prisma.$queryRaw`
        WITH RECURSIVE to_right AS (
            SELECT "Links"."publicationFrom",
                   "Links"."publicationTo",
                   "pfrom".type "publicationFromType",
                   "pto".type "publicationToType",
                   "pfrom".title "publicationFromTitle",
                   "pfrom"."publishedDate" "publicationFromPublishedDate",
                   "pfrom"."currentStatus" "publicationFromCurrentStatus",
                   "pfrom_user"."firstName" "publicationFromFirstName",
                   "pfrom_user"."lastName" "publicationFromLastName"

              FROM "Links"
              LEFT JOIN "Publication" AS pfrom
              ON "pfrom".id = "Links"."publicationFrom"

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "Links"."publicationTo"

              LEFT JOIN "User" AS pfrom_user
              ON "pfrom"."createdBy" = "pfrom_user"."id"

            WHERE "Links"."publicationTo" = ${id}

            UNION ALL

            SELECT l."publicationFrom",
                   l."publicationTo",
                   "pfrom".type "publicationFromType",
                   "pto".type "publicationToType",
                   "pfrom".title "publicationFromTitle",
                   "pfrom"."publishedDate" "publicationFromPublishedDate",
                   "pfrom"."currentStatus" "publicationFromCurrentStatus",
                   "pfrom_user"."firstName" "publicationFromFirstName",
                   "pfrom_user"."lastName" "publicationFromLastName"
              FROM "Links" l
              JOIN to_right
              ON to_right."publicationFrom" = l."publicationTo"

              LEFT JOIN "Publication" AS pfrom
              ON "pfrom".id = "l"."publicationFrom"

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "l"."publicationTo"

              LEFT JOIN "User" AS pfrom_user
              ON "pfrom"."createdBy" = "pfrom_user"."id"

              WHERE "pto"."type" != 'PROBLEM'
        )
        SELECT *
          FROM to_right
         WHERE "publicationToType" != "publicationFromType"
           AND "publicationFromType" != 'PROBLEM'
           AND "publicationFromCurrentStatus" = 'LIVE';
    `;

    return {
        rootPublication,
        linkedFromPublications,
        linkedToPublications
    };
};
