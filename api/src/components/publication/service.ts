import * as client from 'lib/client';
import * as doi from 'lib/doi';
import * as Enum from 'enum';
import * as I from 'interface';
import * as publicationVersionService from 'publicationVersion/service';
import { Prisma } from '@prisma/client';

export const isIdInUse = async (id: string) => {
    const publication = await client.prisma.publication.count({
        where: {
            id
        }
    });

    return Boolean(publication);
};

const defaultPublicationInclude = {
    versions: {
        include: {
            user: {
                select: {
                    id: true,
                    orcid: true,
                    firstName: true,
                    lastName: true,
                    createdAt: true,
                    updatedAt: true,
                    role: true,
                    url: true
                }
            },
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
            funders: {
                select: {
                    id: true,
                    city: true,
                    country: true,
                    name: true,
                    link: true,
                    ror: true,
                    grantId: true
                }
            },
            coAuthors: {
                select: {
                    id: true,
                    linkedUser: true,
                    publicationVersionId: true,
                    confirmedCoAuthor: true,
                    approvalRequested: true,
                    createdAt: true,
                    reminderDate: true,
                    isIndependent: true,
                    affiliations: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            orcid: true,
                            role: true,
                            url: true
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            },
            topics: {
                select: {
                    id: true,
                    title: true,
                    createdAt: true
                }
            },
            additionalInformation: {
                select: {
                    id: true,
                    title: true,
                    url: true,
                    description: true,
                    createdAt: true
                }
            }
        },
        orderBy: {
            versionNumber: 'asc'
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
                    createdAt: true,
                    updatedAt: true
                }
            }
        }
    },
    linkedTo: {
        where: {
            publicationTo: {
                versions: {
                    some: {
                        isLatestLiveVersion: true
                    }
                }
            }
        },
        select: {
            id: true,
            versionToId: true,
            publicationToId: true,
            draft: true,
            publicationTo: {
                select: {
                    id: true,
                    type: true,
                    doi: true,
                    versions: {
                        select: {
                            title: true,
                            publishedDate: true,
                            currentStatus: true,
                            description: true,
                            keywords: true
                        }
                    }
                }
            }
        }
    },
    linkedFrom: {
        where: {
            publicationFrom: {
                versions: {
                    some: {
                        isLatestLiveVersion: true
                    }
                }
            }
        },
        select: {
            id: true,
            versionToId: true,
            publicationFromId: true,
            draft: true,
            publicationFrom: {
                select: {
                    id: true,
                    type: true,
                    doi: true,
                    versions: {
                        select: {
                            title: true,
                            publishedDate: true,
                            currentStatus: true,
                            description: true,
                            keywords: true
                        }
                    }
                }
            }
        }
    }
} satisfies Prisma.PublicationInclude;

type PrivatePublicationInclude = typeof defaultPublicationInclude & {
    versions: {
        include: {
            user: {
                select: {
                    email?: true;
                };
            };
            coAuthors: {
                select: {
                    email?: true;
                };
            };
        };
    };
    publicationFlags: {
        select: {
            user: {
                select: {
                    email?: true;
                };
            };
        };
    };
};
const privatePublicationInclude: PrivatePublicationInclude = structuredClone(defaultPublicationInclude);
privatePublicationInclude.versions.include.user.select.email = true;
privatePublicationInclude.versions.include.coAuthors.select.email = true;
privatePublicationInclude.publicationFlags.select.user.select.email = true;

type DefaultFullPublication = Prisma.PublicationGetPayload<{ include: typeof defaultPublicationInclude }>;
type PrivateFullPublication = Prisma.PublicationGetPayload<{ include: typeof privatePublicationInclude }>;

const getPublicationCounts = (publication: DefaultFullPublication | PrivateFullPublication) => {
    return {
        flagCount: publication.publicationFlags.filter((flag) => !flag.resolved).length,
        peerReviewCount: publication.linkedFrom.filter((child) => child.publicationFrom.type === 'PEER_REVIEW').length
    };
};

export const get = async (id: string) => {
    const publication = await client.prisma.publication.findUnique({
        where: {
            id
        },
        include: defaultPublicationInclude
    });

    // Provide counts
    return publication
        ? {
              ...publication,
              ...getPublicationCounts(publication)
          }
        : publication;
};

export const privateGet = async (id: string) => {
    const publication = await client.prisma.publication.findUnique({
        where: {
            id
        },
        include: privatePublicationInclude
    });

    // Provide counts
    return publication
        ? {
              ...publication,
              ...getPublicationCounts(publication)
          }
        : publication;
};

export const getSeedDataPublications = (title: string) =>
    client.prisma.publication.findMany({
        where: {
            versions: {
                some: {
                    isLatestVersion: true,
                    title,
                    createdBy: 'octopus'
                }
            }
        },
        include: {
            linkedTo: {
                where: {
                    publicationTo: {
                        versions: {
                            some: {
                                isLatestLiveVersion: true
                            }
                        }
                    }
                },
                select: {
                    id: true,
                    publicationToId: true
                }
            }
        }
    });

export const deletePublication = (id: string) =>
    client.prisma.publication.delete({
        where: {
            id
        }
    });

export const upsertOpenSearchRecord = (data: I.OpenSearchPublication) =>
    client.search.update({
        index: 'publications',
        id: data.id,
        body: {
            doc: data,
            doc_as_upsert: true
        }
    });

export const getOpenSearchPublications = (filters: I.OpenSearchPublicationFilters) => {
    const orderBy = filters.orderBy
        ? {
              [filters.orderBy]: {
                  order: filters.orderDirection || 'asc'
              }
          }
        : !filters.search && {
              publishedDate: {
                  order: filters.orderDirection || 'desc'
              }
          };
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
                                ?.split(',')
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

    const must: unknown[] = [];

    if (filters.search) {
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

    // The endpoint does accept both author types at once, but this is the same as not filtering.
    if (filters.authorType && Enum.authorTypes.includes(filters.authorType)) {
        must.push({
            term: {
                organisationalAuthor: filters.authorType === 'organisational'
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

    return client.search.search(query);
};

export const create = async (
    e: I.CreatePublicationRequestBody,
    user: I.User,
    directPublish?: boolean,
    linkedPublications?: {
        publicationId: string;
        versionId: string;
    }[]
) => {
    // Create empty DOI
    const doiRequest = await doi.createEmptyDOI();
    const newDoi = doiRequest.data;

    // If topics are provided, associate the publication to those.
    const topics = e.topicIds?.length
        ? {
              connect: e.topicIds.map((topicId) => ({ id: topicId }))
          }
        : // If not, and this is a direct publish, use the user's default topic.
        directPublish && user.defaultTopicId
        ? {
              connect: { id: user.defaultTopicId }
          }
        : undefined;
    const currentStatus: I.PublicationStatusEnum = directPublish ? 'LIVE' : 'DRAFT';
    const now = new Date().toISOString();
    const publication = await client.prisma.publication.create({
        data: {
            id: newDoi.data.attributes.suffix,
            doi: newDoi.data.attributes.doi,
            type: e.type,
            externalId: e.externalId,
            externalSource: e.externalSource,
            // Create first version when publication is created
            versions: {
                create: {
                    id: newDoi.data.attributes.suffix + '-v1',
                    versionNumber: 1,
                    isLatestLiveVersion: directPublish,
                    currentStatus,
                    // Prisma would handle this, but because we might be manually setting the published date to "now",
                    // make sure these are the same so it isn't confusing. Otherwise, there may be a few milliseconds' difference.
                    createdAt: now,
                    updatedAt: now,
                    publishedDate: directPublish ? now : undefined,
                    title: e.title,
                    licence: e.licence,
                    conflictOfInterestStatus: e.conflictOfInterestStatus,
                    conflictOfInterestText: e.conflictOfInterestText,
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
                    user: {
                        connect: {
                            id: user.id
                        }
                    },
                    publicationStatus: {
                        create: {
                            status: currentStatus
                        }
                    },
                    coAuthors: {
                        // add main author to authors list
                        create: {
                            linkedUser: user.id,
                            email: user.email || '',
                            confirmedCoAuthor: true,
                            approvalRequested: false,
                            // Treat organisational accounts as independent authors.
                            ...(directPublish && { isIndependent: true })
                        }
                    },
                    topics
                }
            },
            // Create links if they were supplied and this is a direct publish.
            ...(directPublish && linkedPublications?.length
                ? {
                      linkedTo: {
                          createMany: {
                              data: linkedPublications.map((linkedPublication) => ({
                                  publicationToId: linkedPublication.publicationId,
                                  versionToId: linkedPublication.versionId,
                                  draft: false
                              }))
                          }
                      }
                  }
                : {})
        },
        include: {
            versions: {
                include: {
                    topics: {
                        select: {
                            id: true,
                            title: true,
                            createdAt: true
                        }
                    }
                }
            },
            linkedTo: true
        }
    });

    if (directPublish) {
        const publishedVersion = await publicationVersionService.get(publication.id, 'latestLive');

        if (publishedVersion) {
            // Run post publish tasks, except PDF generation.
            await publicationVersionService.postPublishHook(publishedVersion, true);
            const upToDatePublication = await get(publication.id);

            return upToDatePublication;
        }
    }

    return publication;
};

export const doesDuplicateFlagExist = (publication, category, user) =>
    client.prisma.publicationFlags.findFirst({
        where: {
            publicationId: publication,
            createdBy: user,
            category,
            resolved: false
        }
    });

type RawLinkedToPublication = {
    childPublicationId: string;
    childPublicationType: I.PublicationType;
    draft: boolean;
    id: string;
    linkId: string;
    liveCurrentStatus: I.PublicationStatusEnum;
    type: I.PublicationType;
};
type RawLinkedFromPublication = {
    draft: boolean;
    id: string;
    linkId: string;
    liveCurrentStatus: I.PublicationStatusEnum;
    parentPublicationId: string;
    parentPublicationType: I.PublicationType;
    type: I.PublicationType;
};

// Get a tree-like representation of linked publications, branching from a root publication.
// The main aim of this is to fetch the data in this particular structure; the bulk of the data
// returned over the API will be populated separately to avoid this query becoming overcomplicated.
const getRawLinkedPublications = async (
    publicationId: string,
    publicationType: I.PublicationType,
    requesterIsAuthor: boolean
): Promise<{
    linkedTo: RawLinkedToPublication[];
    linkedFrom: RawLinkedFromPublication[];
}> => {
    /*
     * This set of queries provides two result sets:
     *
     * "linkedTo" refers to publications to the left of the publication chain.
     * "linkedFrom" refers to publications that follow to the right of the publication chain.
     *
     * The basic function of each query is to recursively select linked publications in each individual direction of the chain.
     * This can then be used to generate a tree representation branching from a root publication.
     *
     * Additionally, to limit the tree size, a linked publication cannot be of the same type (for instance, we aren't looking to return problems linked to other problems)
     */
    const linkedTo = await client.prisma.$queryRaw<RawLinkedToPublication[]>`
        WITH RECURSIVE to_left AS (
            SELECT "Links"."publicationFromId" "childPublicationId",
                "Links"."publicationToId" "id",
                "Links".id "linkId",
                "Links".draft,
                "pfrom".type "childPublicationType",
                "pto".type,
                "pto_live_version"."currentStatus" "liveCurrentStatus"

            FROM "Links"
            LEFT JOIN "Publication" AS pfrom
            ON "pfrom".id = "Links"."publicationFromId"

            LEFT JOIN "Publication" AS pto
            ON "pto".id = "Links"."publicationToId"

            LEFT JOIN "PublicationVersion" AS pto_live_version
            ON "pto".id = "pto_live_version"."versionOf"
            AND "pto_live_version"."isLatestLiveVersion" = TRUE

            WHERE "Links"."publicationFromId" = ${publicationId}

            UNION ALL

            SELECT "Links"."publicationFromId" "childPublicationId",
                "Links"."publicationToId" "id",
                "Links".id "linkId",
                "Links".draft,
                "pfrom".type "childPublicationType",
                "pto".type,
                "pto_live_version"."currentStatus" "liveCurrentStatus"

            FROM "Links"
            JOIN to_left
            ON to_left."id" = "Links"."publicationFromId"

            LEFT JOIN "Publication" AS pfrom
            ON "pfrom".id = "Links"."publicationFromId"

            LEFT JOIN "Publication" AS pto
            ON "pto".id = "Links"."publicationToId"

            LEFT JOIN "PublicationVersion" AS pto_live_version
            ON "pto".id = "pto_live_version"."versionOf"
            AND "pto_live_version"."isLatestLiveVersion" = TRUE
        )

        SELECT DISTINCT * FROM to_left
        WHERE "type" != "childPublicationType"
        AND CAST("type" AS text) != ${publicationType}
        ${!requesterIsAuthor ? Prisma.sql`AND "liveCurrentStatus" = 'LIVE'` : Prisma.empty};
    `;

    const linkedFrom = await client.prisma.$queryRaw<RawLinkedFromPublication[]>`
        WITH RECURSIVE to_right AS (
            SELECT "Links"."publicationFromId" "id",
                "Links"."publicationToId" "parentPublicationId",
                "Links".id "linkId",
                "Links".draft,
                "pfrom".type,
                "pfrom_live_version"."currentStatus" "liveCurrentStatus",
                "pto".type "parentPublicationType"

            FROM "Links"
            LEFT JOIN "Publication" AS pfrom
            ON "pfrom".id = "Links"."publicationFromId"

            LEFT JOIN "Publication" AS pto
            ON "pto".id = "Links"."publicationToId"

            LEFT JOIN "PublicationVersion" AS pfrom_live_version
            ON "pfrom".id = "pfrom_live_version"."versionOf"
            AND "pfrom_live_version"."isLatestLiveVersion" = TRUE

            WHERE "Links"."publicationToId" = ${publicationId}

            UNION ALL

            SELECT "Links"."publicationFromId" "id",
                "Links"."publicationToId" "parentPublicationId",
                "Links".id "linkId",
                "Links".draft,
                "pfrom".type,
                "pfrom_live_version"."currentStatus" "liveCurrentStatus",
                "pto".type "parentPublicationType"

            FROM "Links"
            JOIN to_right
            ON to_right."id" = "Links"."publicationToId"

            LEFT JOIN "Publication" AS pfrom
            ON "pfrom".id = "Links"."publicationFromId"

            LEFT JOIN "Publication" AS pto
            ON "pto".id = "Links"."publicationToId"

            LEFT JOIN "PublicationVersion" AS pfrom_live_version
            ON "pfrom".id = "pfrom_live_version"."versionOf"
            AND "pfrom_live_version"."isLatestLiveVersion" = TRUE

            WHERE "pto"."type" != 'PROBLEM'
        )

        SELECT DISTINCT *
        FROM to_right
        WHERE "type" != "parentPublicationType"
        AND "type" != 'PROBLEM'
        ${!requesterIsAuthor ? Prisma.sql`AND "liveCurrentStatus" = 'LIVE'` : Prisma.empty};
    `;

    return {
        linkedTo,
        linkedFrom
    };
};

const sortPublicationsByPublicationDate = (publications: I.LinkedPublication[]) => {
    return publications.sort((a, b) => {
        if (b.publishedDate && a.publishedDate) {
            // Sort by publication date, most recent first.
            return new Date(b.publishedDate).valueOf() - new Date(a.publishedDate).valueOf();
        } else {
            // If either publication has no published date, put it at the end.
            return Number(!!b.publishedDate) - Number(!!a.publishedDate);
        }
    });
};

/**
 * Sort an array of publications so that the parents/children (in list a) of a publication (in list b)
 * appear close to it in the visualisation.
 * Because of the way we get data from the API, both lists will consist of the same type:
 * LinkedToPublication or LinkedFromPublication.
 * @param a The list of publications to sort
 * @param b The list of publications to sort them in relation to (these should be of the type immediately before
 * or after those in "a")
 * @returns a sorted list of publications
 */
const getOrderedLinkedPublications = (a: I.LinkedPublication[], b: I.LinkedPublication[]): I.LinkedPublication[] => {
    const types = Enum.publicationTypes;
    // Confirm that the type of publications in list a immediately follows or precedes the type of publications in list b
    const aFollowsB = a.every((aPub) => b.every((bPub) => types.indexOf(bPub.type) === types.indexOf(aPub.type) - 1));
    const aPrecedesB = a.every((aPub) => b.every((bPub) => types.indexOf(bPub.type) === types.indexOf(aPub.type) + 1));

    if (!(aFollowsB || aPrecedesB)) {
        console.log('Type mismatch! Abandoning.');

        return [];
    } else {
        const aSorted: I.LinkedPublication[] = [];

        // For each publication in "b"
        for (const bPub of b) {
            aSorted.push(
                ...sortPublicationsByPublicationDate(
                    // Pick the publications from "a" that are parents of the "b" publication...
                    aPrecedesB
                        ? a.filter((aPub) => (aPub as I.LinkedToPublication).childPublicationId === bPub.id)
                        : // Or children, if we're working the other way
                          a.filter((aPub) => (aPub as I.LinkedFromPublication).parentPublicationId === bPub.id)
                )
            );
        }

        return aSorted;
    }
};

// Sort linked publications for visualization - trying to avoid crossing "chains" primarily,
// and ordering by publicationDate secondarily.
const sortLinkedPublicationsForVisualization = (
    linkedTo: I.LinkedToPublication[],
    linkedFrom: I.LinkedFromPublication[],
    selectedPublicationType: I.PublicationType
): {
    linkedTo: I.LinkedToPublication[];
    linkedFrom: I.LinkedFromPublication[];
} => {
    // Process parents by type, proceeding away from the selected publication's type.
    const types = Enum.publicationTypes;
    const filteredPublicationTypes = types.filter((type) => type !== 'PEER_REVIEW');
    const orderedParents: I.LinkedToPublication[] = [];
    let parentTypeIdx = types.indexOf(selectedPublicationType) - 1;

    // For each type, going backwards towards PROBLEM, starting with the one before the selected publication's type...
    while (parentTypeIdx >= 0) {
        const type = filteredPublicationTypes[parentTypeIdx];
        const publicationsOfType = linkedTo.filter((linkedPublication) => linkedPublication.type === type);

        // Sort parents.
        // For the type immediately before the selected publication's type, just order parents by publication date, descending.
        if (parentTypeIdx === types.indexOf(selectedPublicationType) - 1) {
            orderedParents.push(...(sortPublicationsByPublicationDate(publicationsOfType) as I.LinkedToPublication[]));
        } else {
            // For types further along the chain, use custom ordering.
            const precedingType = filteredPublicationTypes[parentTypeIdx + 1];
            const precedingTypePublicationsOrdered = orderedParents.filter(
                (orderedParents) => orderedParents.type === precedingType
            );

            if (precedingTypePublicationsOrdered !== undefined) {
                orderedParents.push(
                    ...(getOrderedLinkedPublications(
                        publicationsOfType,
                        precedingTypePublicationsOrdered
                    ) as I.LinkedToPublication[])
                );
            }
        }

        parentTypeIdx--;
    }

    const orderedChildren: I.LinkedFromPublication[] = [];
    let childTypeIdx = types.indexOf(selectedPublicationType) + 1;

    // For each type, going forwards towards REAL_WORLD_APPLICATION, starting with the one after the selected publication's type...
    while (childTypeIdx <= filteredPublicationTypes.indexOf('REAL_WORLD_APPLICATION')) {
        const type = filteredPublicationTypes[childTypeIdx];
        const publicationsOfType = linkedFrom.filter((linkedPublication) => linkedPublication.type === type);

        // Sort child publications.
        // For the type immediately after the selected publication's type, just order children by publication date, descending.
        if (childTypeIdx === types.indexOf(selectedPublicationType) + 1) {
            orderedChildren.push(
                ...(sortPublicationsByPublicationDate(publicationsOfType) as I.LinkedFromPublication[])
            );
        } else {
            // For types further along the chain, order them to keep the visualisation as neat as we can.
            // Pass the publications of the type we want to sort, and the (sorted) publications of the type before that.
            const precedingType = filteredPublicationTypes[childTypeIdx - 1];
            const precedingTypePublicationsOrdered = orderedChildren.filter(
                (orderedChild) => orderedChild.type === precedingType
            );

            if (precedingTypePublicationsOrdered !== undefined) {
                orderedChildren.push(
                    ...(getOrderedLinkedPublications(
                        publicationsOfType,
                        precedingTypePublicationsOrdered
                    ) as I.LinkedFromPublication[])
                );
            }
        }

        childTypeIdx++;
    }

    return {
        linkedTo: orderedParents,
        linkedFrom: orderedChildren
    };
};

// Take raw linked publications from a raw SQL query and populate them with the requisite data for the response.
const populateRawLinkedPublicationData = async (
    linkedTo: RawLinkedToPublication[],
    linkedFrom: RawLinkedFromPublication[],
    userId: string | null
): Promise<{
    linkedTo: I.LinkedToPublication[];
    linkedFrom: I.LinkedFromPublication[];
}> => {
    // Make values unique because the same publication may be linked with different children/parents.
    const linkedPublicationIds = [
        ...new Set(linkedTo.map((link) => link.id).concat(linkedFrom.map((link) => link.id)))
    ];

    const linkedVersions = await client.prisma.publicationVersion.findMany({
        // Get the latest live version and any current draft version of publications returned by the raw queries.
        where: {
            OR: [
                {
                    isLatestLiveVersion: true,
                    versionOf: {
                        in: linkedPublicationIds
                    }
                },
                {
                    currentStatus: {
                        not: 'LIVE'
                    },
                    isLatestVersion: true,
                    versionOf: {
                        in: linkedPublicationIds
                    }
                }
            ]
        },
        select: {
            createdBy: true,
            currentStatus: true,
            isLatestVersion: true,
            isLatestLiveVersion: true,
            publishedDate: true,
            title: true,
            versionOf: true,
            coAuthors: {
                select: {
                    id: true,
                    linkedUser: true,
                    user: {
                        select: {
                            orcid: true,
                            firstName: true,
                            lastName: true,
                            role: true,
                            url: true
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            },
            publication: {
                select: {
                    doi: true,
                    externalSource: true,
                    publicationFlags: {
                        where: {
                            resolved: false
                        }
                    },
                    linkedFrom: {
                        where: {
                            publicationFrom: {
                                type: 'PEER_REVIEW',
                                versions: {
                                    some: {
                                        isLatestLiveVersion: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            user: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    });

    // Get the fields ready for the response.
    const tidyRawLinkedPublication = (
        options:
            | {
                  link: RawLinkedToPublication;
                  direction: 'to';
              }
            | { link: RawLinkedFromPublication; direction: 'from' }
    ): I.LinkedToPublication | I.LinkedFromPublication => {
        const { direction, link } = options;
        const latestLiveVersion = linkedVersions.find(
            (version) => version.versionOf === link.id && version.isLatestLiveVersion
        );
        const draftVersion = linkedVersions.find(
            (version) => version.versionOf === link.id && version.isLatestVersion && version.currentStatus !== 'LIVE'
        );
        const isInitialDraft = !!draftVersion && !latestLiveVersion;

        // Fields whose source depends on whether the publication is draft or live.
        let conditionalFields: Pick<
            I.LinkedPublication,
            'doi' | 'title' | 'publishedDate' | 'currentStatus' | 'createdBy'
        >;
        let authorFields: Pick<I.LinkedPublication, 'authorFirstName' | 'authorLastName' | 'authors'>;

        if (isInitialDraft) {
            // Only draft version is available, so get details from that.
            conditionalFields = {
                doi: draftVersion.publication.doi,
                title: draftVersion.title,
                publishedDate: null,
                currentStatus: draftVersion.currentStatus,
                createdBy: draftVersion.createdBy
            };

            const requesterIsAuthorOnLinkedDraft =
                !!userId && draftVersion?.coAuthors.some((author) => author.linkedUser === userId);

            // Author details should only be returned to someone with access to the draft.
            if (requesterIsAuthorOnLinkedDraft) {
                authorFields = {
                    authorFirstName: draftVersion.user.firstName,
                    authorLastName: draftVersion.user.lastName,
                    authors: draftVersion.coAuthors
                };
            } else {
                authorFields = {
                    ...conditionalFields,
                    authorFirstName: null,
                    authorLastName: null,
                    authors: null
                };
            }
        } else {
            if (!latestLiveVersion) {
                throw Error(`No draft or live version found for linked publication ${link.id}`);
            }

            conditionalFields = {
                doi: latestLiveVersion.publication.doi,
                title: latestLiveVersion.title,
                publishedDate: latestLiveVersion.publishedDate?.toISOString() || null,
                currentStatus: latestLiveVersion.currentStatus,
                createdBy: latestLiveVersion.createdBy
            };
            authorFields = {
                authorFirstName: latestLiveVersion.user.firstName,
                authorLastName: latestLiveVersion.user.lastName,
                authors: latestLiveVersion.coAuthors
            };
        }

        let directionalFields:
            | Pick<
                  I.LinkedToPublication,
                  'childPublicationId' | 'childPublicationType' | 'draft' | 'externalSource' | 'linkId'
              >
            | Pick<I.LinkedFromPublication, 'draft' | 'linkId' | 'parentPublicationId' | 'parentPublicationType'>;

        if (direction === 'to') {
            const { childPublicationId, childPublicationType, draft, linkId } = link;
            directionalFields = {
                childPublicationId,
                childPublicationType,
                draft,
                // One of these will be defined due to the error thrown above, and they have the same value.
                externalSource:
                    latestLiveVersion?.publication.externalSource ?? draftVersion?.publication.externalSource ?? null,
                linkId
            };
        } else {
            const { draft, linkId, parentPublicationId, parentPublicationType } = link;
            directionalFields = {
                draft,
                linkId,
                parentPublicationId,
                parentPublicationType
            };
        }

        return {
            ...conditionalFields,
            ...authorFields,
            ...directionalFields,
            id: link.id,
            type: link.type,
            flagCount: latestLiveVersion?.publication.publicationFlags.length || 0,
            peerReviewCount: latestLiveVersion?.publication.linkedFrom.length || 0
        };
    };

    const tidiedLinkedTo = linkedTo.map((link) =>
        tidyRawLinkedPublication({ link, direction: 'to' })
    ) as I.LinkedToPublication[];
    const tidiedLinkedFrom = linkedFrom.map((link) =>
        tidyRawLinkedPublication({ link, direction: 'from' })
    ) as I.LinkedFromPublication[];

    return {
        linkedTo: tidiedLinkedTo,
        linkedFrom: tidiedLinkedFrom
    };
};

export const getLinksForPublication = async (
    id: string,
    requesterUserId: string | null
): Promise<I.PublicationWithLinks> => {
    const publication = await get(id);

    if (!publication) {
        return {
            publication: null,
            linkedFrom: [],
            linkedTo: []
        };
    }

    const latestVersion = publication.versions.find((version) => version.isLatestVersion);
    const latestLiveVersion = publication.versions.find((version) => version.isLatestLiveVersion);
    const requesterIsAuthorOnDraft =
        !!requesterUserId &&
        !!latestVersion &&
        latestVersion.currentStatus !== 'LIVE' &&
        latestVersion.coAuthors.some((author) => author.linkedUser === requesterUserId);
    const noVersionIsViewable = !(requesterIsAuthorOnDraft || latestLiveVersion);

    // If no viewable version is found, return nothing.
    if (noVersionIsViewable) {
        return {
            publication: null,
            linkedFrom: [],
            linkedTo: []
        };
    }

    const { linkedTo, linkedFrom } = await getRawLinkedPublications(id, publication.type, requesterIsAuthorOnDraft);

    const { linkedTo: populatedLinkedTo, linkedFrom: populatedLinkedFrom } = await populateRawLinkedPublicationData(
        linkedTo,
        linkedFrom,
        requesterUserId
    );

    // Sort data for visualization.
    const { linkedTo: orderedParents, linkedFrom: orderedChildren } = sortLinkedPublicationsForVisualization(
        populatedLinkedTo,
        populatedLinkedFrom,
        publication.type
    );

    // A way to only return what we need from the coAuthors from the publication get() call.
    const mapFullCoAuthor = (
        coAuthor: (typeof publication.versions)[number]['coAuthors'][number]
    ): I.LinkedPublicationAuthor => ({
        id: coAuthor.id,
        linkedUser: coAuthor.linkedUser,
        user: coAuthor.user
            ? {
                  firstName: coAuthor.user.firstName,
                  lastName: coAuthor.user.lastName,
                  orcid: coAuthor.user.orcid,
                  role: coAuthor.user.role,
                  url: coAuthor.user.url
              }
            : null
    });

    // Assemble data for the selected publication.
    // Return draft data if allowed, otherwise use live version's data.
    let conditionalFields: Pick<
        I.LinkedPublication,
        'title' | 'publishedDate' | 'currentStatus' | 'createdBy' | 'authorFirstName' | 'authorLastName' | 'authors'
    >;

    if (requesterIsAuthorOnDraft) {
        conditionalFields = {
            title: latestVersion.title,
            publishedDate: null,
            currentStatus: latestVersion.currentStatus,
            createdBy: latestVersion.createdBy,
            authorFirstName: latestVersion.user.firstName,
            authorLastName: latestVersion.user.lastName,
            authors: latestVersion.coAuthors.map((author) => mapFullCoAuthor(author))
        };
    } else {
        if (!latestLiveVersion) {
            throw Error(`No viewable draft or live version found for publication ${id}`);
        }

        conditionalFields = {
            title: latestLiveVersion.title,
            publishedDate: latestLiveVersion.publishedDate?.toISOString() || null,
            currentStatus: latestLiveVersion.currentStatus,
            createdBy: latestLiveVersion.createdBy || '',
            authorFirstName: latestLiveVersion.user.firstName,
            authorLastName: latestLiveVersion.user.lastName,
            authors: latestLiveVersion.coAuthors
        };
    }

    const publicationData = {
        ...conditionalFields,
        id: publication.id,
        type: publication.type,
        doi: publication.doi,
        flagCount: publication.flagCount,
        peerReviewCount: publication.peerReviewCount
    };

    return {
        publication: publicationData,
        linkedTo: orderedParents,
        linkedFrom: orderedChildren
    };
};

export const getDirectLinksForPublication = async (
    id: string,
    userId: string | null,
    requesterIsAuthor = false
): Promise<I.PublicationWithLinks> => {
    // Get only the live version of the main publication if not an author, otherwise draft and live.
    const versionFilter: Prisma.PublicationVersionWhereInput = requesterIsAuthor
        ? { OR: [{ isLatestVersion: true }, { isLatestLiveVersion: true }] }
        : { isLatestLiveVersion: true };
    // Authors can get all links made from this publication, but non-authors can only see live links.
    const linkedToFilter: Prisma.LinksWhereInput = requesterIsAuthor
        ? {}
        : {
              draft: false,
              publicationTo: {
                  versions: {
                      some: {
                          isLatestLiveVersion: true
                      }
                  }
              }
          };
    // Same with links made to this publication.
    const linkedFromFilter: Prisma.LinksWhereInput = requesterIsAuthor
        ? {}
        : {
              draft: false,
              publicationFrom: {
                  versions: {
                      some: {
                          isLatestLiveVersion: true
                      }
                  }
              }
          };
    // You can only get live versions of linked publications unless you're an author.
    const linkedVersionFilter: Prisma.PublicationVersionWhereInput = requesterIsAuthor
        ? {}
        : {
              isLatestLiveVersion: true
          };

    const publication = await client.prisma.publication.findUnique({
        where: {
            id
        },
        include: {
            versions: {
                where: versionFilter,
                include: {
                    coAuthors: {
                        include: {
                            user: true
                        }
                    },
                    user: true
                }
            },
            linkedTo: {
                where: linkedToFilter,
                select: {
                    id: true,
                    draft: true,
                    versionTo: {
                        select: {
                            id: true,
                            isLatestLiveVersion: true,
                            versionNumber: true
                        }
                    },
                    publicationTo: {
                        select: {
                            id: true,
                            doi: true,
                            type: true,
                            externalSource: true,
                            versions: {
                                where: linkedVersionFilter,
                                include: {
                                    coAuthors: {
                                        select: {
                                            id: true,
                                            linkedUser: true,
                                            user: {
                                                select: {
                                                    firstName: true,
                                                    lastName: true,
                                                    orcid: true,
                                                    role: true,
                                                    url: true
                                                }
                                            }
                                        }
                                    },
                                    user: true
                                }
                            },
                            publicationFlags: {
                                where: {
                                    resolved: false
                                }
                            },
                            linkedFrom: {
                                where: {
                                    publicationFrom: {
                                        type: 'PEER_REVIEW',
                                        versions: {
                                            some: {
                                                isLatestLiveVersion: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            linkedFrom: {
                where: linkedFromFilter,
                select: {
                    id: true,
                    draft: true,
                    versionTo: {
                        select: {
                            id: true,
                            isLatestLiveVersion: true,
                            versionNumber: true
                        }
                    },
                    publicationFrom: {
                        select: {
                            id: true,
                            doi: true,
                            type: true,
                            versions: {
                                where: linkedVersionFilter,
                                include: {
                                    coAuthors: {
                                        select: {
                                            id: true,
                                            linkedUser: true,
                                            user: {
                                                select: {
                                                    firstName: true,
                                                    lastName: true,
                                                    orcid: true,
                                                    role: true,
                                                    url: true
                                                }
                                            }
                                        }
                                    },
                                    user: true
                                }
                            },
                            publicationFlags: {
                                where: {
                                    resolved: false
                                }
                            },
                            linkedFrom: {
                                where: {
                                    publicationFrom: {
                                        type: 'PEER_REVIEW',
                                        versions: {
                                            some: {
                                                isLatestLiveVersion: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            publicationFlags: {
                where: {
                    resolved: false
                }
            }
        }
    });

    if (!publication) {
        return {
            publication: null,
            linkedFrom: [],
            linkedTo: []
        };
    }

    const latestLiveVersion = publication.versions[0];

    if (!latestLiveVersion) {
        return {
            publication: null,
            linkedFrom: [],
            linkedTo: []
        };
    }

    const linkedTo: I.LinkedToPublication[] = publication.linkedTo.map((link) => {
        const { id: linkId, publicationTo, versionTo, draft } = link;
        const { id, type, versions, doi: publicationDoi, publicationFlags, linkedFrom, externalSource } = publicationTo;
        const initialDraftVersion = versions.find(
            (version) => version.versionNumber === 1 && version.currentStatus !== 'LIVE'
        );
        const liveVersion = versions.find((version) => version.isLatestLiveVersion);
        const versionToUse = initialDraftVersion ?? liveVersion;

        if (!versionToUse) {
            throw Error(`Could not find version for linked publication ${id}`);
        }

        const { createdBy, currentStatus, publishedDate, title } = versionToUse;
        const userIsAuthorOnInitialDraft =
            initialDraftVersion && initialDraftVersion.coAuthors.some((author) => author.linkedUser === userId);

        const authorFields = liveVersion
            ? {
                  authorFirstName: liveVersion.user.firstName,
                  authorLastName: liveVersion.user.lastName,
                  authors: liveVersion.coAuthors
              }
            : userIsAuthorOnInitialDraft
            ? {
                  authorFirstName: initialDraftVersion.user.firstName,
                  authorLastName: initialDraftVersion.user.lastName,
                  authors: initialDraftVersion.coAuthors
              }
            : {
                  authorFirstName: '',
                  authorLastName: '',
                  authors: []
              };

        return {
            id,
            draft,
            linkId,
            type,
            doi: publicationDoi,
            childPublicationId: publication.id,
            childPublicationType: publication.type,
            parentVersionId: versionTo.id,
            parentVersionNumber: versionTo.versionNumber,
            parentVersionIsLatestLive: versionTo.isLatestLiveVersion,
            title: title || null,
            createdBy,
            currentStatus,
            publishedDate: publishedDate?.toISOString() || null,
            flagCount: publicationFlags.length,
            peerReviewCount: linkedFrom.length,
            externalSource,
            ...authorFields
        };
    });

    const linkedFrom: I.LinkedFromPublication[] = publication.linkedFrom.map((link) => {
        const { id: linkId, publicationFrom, versionTo, draft } = link;
        const { id, type, versions, doi: publicationDoi, publicationFlags, linkedFrom } = publicationFrom;
        const initialDraftVersion = versions.find(
            (version) => version.versionNumber === 1 && version.currentStatus !== 'LIVE'
        );
        const liveVersion = versions.find((version) => version.isLatestLiveVersion);
        const versionToUse = initialDraftVersion ?? liveVersion;

        if (!versionToUse) {
            throw Error(`Could not find version for linked publication ${id}`);
        }

        const { createdBy, currentStatus, publishedDate, title } = versionToUse;
        const userIsAuthorOnInitialDraft =
            initialDraftVersion && initialDraftVersion.coAuthors.some((author) => author.linkedUser === userId);

        const authorFields = liveVersion
            ? {
                  authorFirstName: liveVersion.user.firstName,
                  authorLastName: liveVersion.user.lastName,
                  authors: liveVersion.coAuthors
              }
            : userIsAuthorOnInitialDraft
            ? {
                  authorFirstName: initialDraftVersion.user.firstName,
                  authorLastName: initialDraftVersion.user.lastName,
                  authors: initialDraftVersion.coAuthors
              }
            : {
                  authorFirstName: null,
                  authorLastName: null,
                  authors: null
              };

        return {
            id,
            draft,
            linkId,
            type,
            doi: publicationDoi,
            parentPublicationId: publication.id,
            parentPublicationType: publication.type,
            parentVersionId: versionTo.id,
            parentVersionNumber: versionTo.versionNumber,
            parentVersionIsLatestLive: versionTo.isLatestLiveVersion,
            title: title || null,
            createdBy,
            currentStatus,
            publishedDate: publishedDate?.toISOString() || null,
            flagCount: publicationFlags.length,
            peerReviewCount: linkedFrom.length,
            ...authorFields
        };
    });

    return {
        publication: {
            id: publication.id,
            type: publication.type,
            doi: publication.doi,
            title: latestLiveVersion.title || null,
            createdBy: latestLiveVersion.createdBy,
            currentStatus: latestLiveVersion.currentStatus,
            publishedDate: latestLiveVersion.publishedDate?.toISOString() || null,
            authorFirstName: latestLiveVersion.user.firstName,
            authorLastName: latestLiveVersion.user.lastName || null,
            authors: latestLiveVersion.coAuthors.map((author) => ({
                id: author.id,
                linkedUser: author.linkedUser,
                user: {
                    orcid: author.user?.orcid || '',
                    firstName: author.user?.firstName || '',
                    lastName: author.user?.lastName || '',
                    role: author.user?.role || 'USER',
                    url: author.user?.url || ''
                }
            })),
            flagCount: publication.publicationFlags.length,
            peerReviewCount: publication.linkedFrom.filter((child) => child.publicationFrom.type === 'PEER_REVIEW')
                .length
        },
        linkedTo,
        linkedFrom
    };
};

export const isLive = async (id: string) => {
    const livePublication = await client.prisma.publication.findFirst({
        where: { id, versions: { some: { currentStatus: 'LIVE' } } }
    });

    return !!livePublication;
};
