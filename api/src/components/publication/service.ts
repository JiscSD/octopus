import axios from 'axios';
import * as I from 'interface';
import * as client from 'lib/client';
import * as Enum from 'enum';
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

export const get = async (id: string) => {
    const publication = await client.prisma.publication.findUnique({
        where: {
            id
        },
        include: {
            versions: {
                include: {
                    user: {
                        select: {
                            id: true,
                            orcid: true,
                            firstName: true,
                            lastName: true,
                            email: true,
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
                            email: true,
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
                            email: true,
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
        }
    });

    // Provide counts
    return publication
        ? {
              ...publication,
              flagCount: publication.publicationFlags.filter((flag) => !flag.resolved).length,
              peerReviewCount: publication.linkedFrom.filter((child) => child.publicationFrom.type === 'PEER_REVIEW')
                  .length
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

    const must: unknown[] = [];

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
    const payload = {
        data: {
            type: 'dois',
            attributes: {
                prefix: process.env.DOI_PREFIX
            }
        }
    };

    const doiRequest = await axios.post<I.DOIResponse>(process.env.DATACITE_ENDPOINT as string, payload, {
        auth: {
            username: process.env.DATACITE_USER as string,
            password: process.env.DATACITE_PASSWORD as string
        }
    });
    const doi = doiRequest.data;

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
            id: doi.data.attributes.suffix,
            doi: doi.data.attributes.doi,
            type: e.type,
            externalId: e.externalId,
            externalSource: e.externalSource,
            // Create first version when publication is created
            versions: {
                create: {
                    id: doi.data.attributes.suffix + '-v1',
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

const sortPublicationsByPublicationDate = (publications: I.LinkedPublication[]) => {
    return publications.sort((a, b) => new Date(b.publishedDate).valueOf() - new Date(a.publishedDate).valueOf());
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
                        ? a.filter((aPub) => (aPub as I.LinkedToPublication).childPublication === bPub.id)
                        : // Or children, if we're working the other way
                          a.filter((aPub) => (aPub as I.LinkedFromPublication).parentPublication === bPub.id)
                )
            );
        }

        return aSorted;
    }
};

export const getLinksForPublication = async (
    id: string,
    includeDraftVersion = false
): Promise<I.PublicationWithLinks> => {
    const publication = await get(id);

    if (!publication) {
        return {
            publication: null,
            linkedFrom: [],
            linkedTo: []
        };
    }

    const latestVersion = publication?.versions.find((version) =>
        includeDraftVersion ? version.isLatestVersion : version.isLatestLiveVersion
    );

    if (!latestVersion) {
        return {
            publication: null,
            linkedFrom: [],
            linkedTo: []
        };
    }

    /*
     * This set of queries provides two result sets:
     *
     * "linkedTo" refers to publications to the left of the publication chain.
     * "linkedFrom" refers to publications that follow to the right of the publication chain.
     *
     * The basic function of each query is to recursively select linked publications in each individual direction of the chain.
     * This can then be used to generate a tree representation branching from a root publication.
     *
     * Additional rules:
     *
     * 1. Only LIVE publications are returned.
     * 2. To limit the tree size, a linked publication cannot be of the same type (for instance, we aren't looking to return problems linked to other problems)
     */

    const linkedTo = await client.prisma.$queryRaw<I.LinkedToPublication[]>`
        WITH RECURSIVE to_left AS (
            SELECT "Links"."id" "linkId",
                   "Links"."publicationFromId" "childPublication",
                   "Links"."publicationToId" "id",
                   "Links".draft,
                   "pfrom".type "childPublicationType",
                   "pto".type,
                   "pto"."doi",
                   "pto_version".title,
                   "pto_version"."createdBy",
                   "pto_version"."publishedDate",
                   "pto_version"."currentStatus",
                   "pto_user"."firstName" "authorFirstName",
                   "pto_user"."lastName" "authorLastName"

              FROM "Links"
              LEFT JOIN "Publication" AS pfrom
              ON "pfrom".id = "Links"."publicationFromId"

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "Links"."publicationToId"

              LEFT JOIN "PublicationVersion" AS pto_version
              ON "pto".id = "pto_version"."versionOf"
              AND "pto_version"."isLatestLiveVersion" = TRUE

              LEFT JOIN "User" AS pto_user
              ON "pto_version"."createdBy" = "pto_user"."id"

            WHERE "Links"."publicationFromId" = ${id}

            UNION ALL

            SELECT l."id" "linkId",
                   l."publicationFromId" "childPublication",
                   l."publicationToId" "id",
                   l."draft",
                   "pfrom".type "childPublicationType",
                   "pto".type,
                   "pto"."doi",
                   "pto_version".title,
                   "pto_version"."createdBy",
                   "pto_version"."publishedDate",
                   "pto_version"."currentStatus",
                   "pto_user"."firstName" "authorFirstName",
                   "pto_user"."lastName" "authorLastName"

              FROM "Links" l
              JOIN to_left
              ON to_left."id" = l."publicationFromId"

              LEFT JOIN "Publication" AS pfrom
              ON "pfrom".id = "l"."publicationFromId"

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "l"."publicationToId"

              LEFT JOIN "PublicationVersion" AS pto_version
              ON "pto".id = "pto_version"."versionOf"
              AND "pto_version"."isLatestLiveVersion" = TRUE

              LEFT JOIN "User" AS pto_user
              ON "pto_version"."createdBy" = "pto_user"."id"
        )
        
        SELECT DISTINCT * FROM to_left
        WHERE "type" != "childPublicationType"
            AND CAST("type" AS text) != ${publication?.type}
            AND "currentStatus" = 'LIVE';
    `;

    const linkedFrom = await client.prisma.$queryRaw<I.LinkedFromPublication[]>`
        WITH RECURSIVE to_right AS (
            SELECT "Links"."id" "linkId",
                   "Links"."publicationFromId" "id",
                   "Links"."publicationToId" "parentPublication",
                   "Links".draft,
                   "pfrom".type,
                   "pfrom"."doi",
                   "pto".type "parentPublicationType",
                   "pfrom_version"."title",
                   "pfrom_version"."createdBy",
                   "pfrom_version"."publishedDate",
                   "pfrom_version"."currentStatus",
                   "pfrom_user"."firstName" "authorFirstName",
                   "pfrom_user"."lastName" "authorLastName"

              FROM "Links"
              LEFT JOIN "Publication" AS pfrom
              ON "pfrom".id = "Links"."publicationFromId"

              LEFT JOIN "PublicationVersion" AS pfrom_version
              ON "pfrom".id = "pfrom_version"."versionOf"
              AND "pfrom_version"."isLatestLiveVersion" = TRUE

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "Links"."publicationToId"

              LEFT JOIN "User" AS pfrom_user
              ON "pfrom_version"."createdBy" = "pfrom_user"."id"

            WHERE "Links"."publicationToId" = ${id}

            UNION ALL

            SELECT l."id" "linkId",
                   l."publicationFromId" "id",
                   l."publicationToId" "parentPublication",
                   l."draft",
                   "pfrom".type,
                   "pfrom"."doi",
                   "pto".type "parentPublicationType",
                   "pfrom_version"."title",
                   "pfrom_version"."createdBy",
                   "pfrom_version"."publishedDate",
                   "pfrom_version"."currentStatus",
                   "pfrom_user"."firstName" "authorFirstName",
                   "pfrom_user"."lastName" "authorLastName"
              FROM "Links" l
              JOIN to_right
              ON to_right."id" = l."publicationToId"

              LEFT JOIN "Publication" AS pfrom
              ON "pfrom".id = "l"."publicationFromId"

              LEFT JOIN "PublicationVersion" AS pfrom_version
              ON "pfrom".id = "pfrom_version"."versionOf"
              AND "pfrom_version"."isLatestLiveVersion" = TRUE

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "l"."publicationToId"

              LEFT JOIN "User" AS pfrom_user
              ON "pfrom_version"."createdBy" = "pfrom_user"."id"

              WHERE "pto"."type" != 'PROBLEM'
        )
        SELECT DISTINCT *
          FROM to_right
         WHERE "type" != "parentPublicationType"
           AND "type" != 'PROBLEM'
           AND "currentStatus" = 'LIVE';
    `;

    const publicationIds = linkedTo.map((link) => link.id).concat(linkedFrom.map((link) => link.id));

    // Get extra details for linked publications
    const versions = await client.prisma.publicationVersion.findMany({
        where: {
            isLatestLiveVersion: true,
            versionOf: {
                in: publicationIds
            }
        },
        select: {
            versionOf: true,
            coAuthors: {
                select: {
                    id: true,
                    linkedUser: true,
                    user: {
                        select: {
                            orcid: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            },
            publication: {
                select: {
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
    });

    // Add authors and counts to 'linkedTo' publications
    linkedTo.forEach((link) => {
        const latestVersion = versions.find((version) => version.versionOf === link.id);

        Object.assign(link, {
            authors: latestVersion?.coAuthors || [],
            flagCount: latestVersion?.publication.publicationFlags.length || 0,
            peerReviewCount: latestVersion?.publication.linkedFrom.length || 0
        });
    });

    // Add authors and counts to 'linkedFrom' publications
    linkedFrom.forEach((link) => {
        const latestVersion = versions.find((version) => version.versionOf === link.id);

        Object.assign(link, {
            authors: latestVersion?.coAuthors || [],
            flagCount: latestVersion?.publication.publicationFlags.length || 0,
            peerReviewCount: latestVersion?.publication.linkedFrom.length || 0
        });
    });

    // Sorting - this is a custom order to make the visualisation neater.
    // Process parents by type, proceeding away from the selected publication's type.
    const types = Enum.publicationTypes;
    const filteredPublicationTypes = types.filter((type) => type !== 'PEER_REVIEW');
    const orderedParents: I.LinkedToPublication[] = [];
    let parentTypeIdx = types.indexOf(publication.type) - 1;

    // For each type, going backwards towards PROBLEM, starting with the one before the selected publication's type...
    while (parentTypeIdx >= 0) {
        const type = filteredPublicationTypes[parentTypeIdx];
        const publicationsOfType = linkedTo.filter((linkedPublication) => linkedPublication.type === type);

        // Sort parents.
        // For the type immediately before the selected publication's type, just order parents by publication date, descending.
        if (parentTypeIdx === types.indexOf(publication.type) - 1) {
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
    let childTypeIdx = types.indexOf(publication.type) + 1;

    // For each type, going forwards towards REAL_WORLD_APPLICATION, starting with the one after the selected publication's type...
    while (childTypeIdx <= filteredPublicationTypes.indexOf('REAL_WORLD_APPLICATION')) {
        const type = filteredPublicationTypes[childTypeIdx];
        const publicationsOfType = linkedFrom.filter((linkedPublication) => linkedPublication.type === type);

        // Sort child publications.
        // For the type immediately after the selected publication's type, just order children by publication date, descending.
        if (childTypeIdx === types.indexOf(publication.type) + 1) {
            orderedChildren.push(
                ...publicationsOfType.sort(
                    (a, b) => new Date(b.publishedDate).valueOf() - new Date(a.publishedDate).valueOf()
                )
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
        publication: {
            id: publication.id,
            type: publication.type,
            doi: publication.doi,
            title: latestVersion.title || '',
            createdBy: latestVersion.createdBy,
            currentStatus: latestVersion.currentStatus,
            publishedDate: latestVersion.publishedDate?.toISOString() || '',
            authorFirstName: latestVersion.user.firstName,
            authorLastName: latestVersion.user.lastName || '',
            authors: latestVersion.coAuthors.map((author) => ({
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
            flagCount: publication.flagCount,
            peerReviewCount: publication.peerReviewCount
        },
        linkedTo: orderedParents,
        linkedFrom: orderedChildren
    };
};

export const getDirectLinksForPublication = async (
    id: string,
    includeDraftVersion = false
): Promise<I.PublicationWithLinks> => {
    const publicationFilter: Prisma.PublicationVersionWhereInput = includeDraftVersion
        ? { isLatestVersion: true }
        : { isLatestLiveVersion: true };

    const publication = await client.prisma.publication.findUnique({
        where: {
            id
        },
        include: {
            versions: {
                where: {
                    ...publicationFilter
                },
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
                where: {
                    draft: includeDraftVersion ? undefined : includeDraftVersion,
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
                                where: {
                                    isLatestLiveVersion: true
                                },
                                include: {
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
                where: {
                    draft: includeDraftVersion ? undefined : includeDraftVersion,
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
                                where: {
                                    isLatestLiveVersion: true
                                },
                                include: {
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
        const { id, type, versions, doi, publicationFlags, linkedFrom, externalSource } = publicationTo;
        const { createdBy, user, currentStatus, publishedDate, title } = versions[0];

        return {
            id,
            draft,
            linkId,
            type,
            doi,
            childPublication: publication.id,
            childPublicationType: publication.type,
            parentVersionId: versionTo.id,
            parentVersionNumber: versionTo.versionNumber,
            parentVersionIsLatestLive: versionTo.isLatestLiveVersion,
            title: title || '',
            createdBy,
            authorFirstName: user.firstName,
            authorLastName: user.lastName || '',
            currentStatus,
            publishedDate: publishedDate?.toISOString() || '',
            authors: [],
            flagCount: publicationFlags.length,
            peerReviewCount: linkedFrom.length,
            externalSource
        };
    });

    const linkedFrom: I.LinkedFromPublication[] = publication.linkedFrom.map((link) => {
        const { id: linkId, publicationFrom, versionTo, draft } = link;
        const { id, type, versions, doi, publicationFlags, linkedFrom } = publicationFrom;
        const { createdBy, user, currentStatus, publishedDate, title } = versions[0];

        return {
            id,
            draft,
            linkId,
            type,
            doi,
            parentPublication: publication.id,
            parentPublicationType: publication.type,
            parentVersionId: versionTo.id,
            parentVersionNumber: versionTo.versionNumber,
            parentVersionIsLatestLive: versionTo.isLatestLiveVersion,
            title: title || '',
            createdBy,
            authorFirstName: user.firstName,
            authorLastName: user.lastName || '',
            currentStatus,
            publishedDate: publishedDate?.toISOString() || '',
            authors: [],
            flagCount: publicationFlags.length,
            peerReviewCount: linkedFrom.length
        };
    });

    const publicationIds = linkedTo.map((link) => link.id).concat(linkedFrom.map((link) => link.id));

    // get coAuthors for each latest LIVE version of each publication
    const versions = await client.prisma.publicationVersion.findMany({
        where: {
            isLatestLiveVersion: true,
            versionOf: {
                in: publicationIds
            }
        },
        select: {
            versionOf: true,
            coAuthors: {
                select: {
                    id: true,
                    linkedUser: true,
                    user: {
                        select: {
                            orcid: true,
                            firstName: true,
                            lastName: true
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            }
        }
    });

    // add authors to 'linkedTo' publications
    linkedTo.forEach((link) => {
        const authors = versions.find((version) => version.versionOf === link.id)?.coAuthors || [];

        Object.assign(link, {
            authors
        });
    });

    // add authors to 'linkedFrom' publications
    linkedFrom.forEach((link) => {
        const authors = versions.find((version) => version.versionOf === link.id)?.coAuthors || [];

        Object.assign(link, {
            authors
        });
    });

    return {
        publication: {
            id: publication.id,
            type: publication.type,
            doi: publication.doi,
            title: latestLiveVersion.title || '',
            createdBy: latestLiveVersion.createdBy,
            currentStatus: latestLiveVersion.currentStatus,
            publishedDate: latestLiveVersion.publishedDate?.toISOString() || '',
            authorFirstName: latestLiveVersion.user.firstName,
            authorLastName: latestLiveVersion.user.lastName || '',
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
