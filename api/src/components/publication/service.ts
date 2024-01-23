import chromium from '@sparticuz/chromium';
import * as s3 from 'lib/s3';
import * as I from 'interface';
import * as client from 'lib/client';
import * as referenceService from 'reference/service';
import * as Helpers from 'lib/helpers';
import { Browser, launch } from 'puppeteer-core';
import { PutObjectCommand } from '@aws-sdk/client-s3';
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
    return await client.prisma.publication.findUnique({
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
                            updatedAt: true
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
                            ror: true
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
                                    orcid: true
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
                    publicationToRef: {
                        versions: {
                            some: {
                                isLatestLiveVersion: true
                            }
                        }
                    }
                },
                select: {
                    id: true,
                    publicationToRef: {
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
                    publicationFromRef: {
                        versions: {
                            some: {
                                isLatestLiveVersion: true
                            }
                        }
                    }
                },
                select: {
                    id: true,
                    publicationFromRef: {
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
};

export const getSeedDataPublications = async (title: string) => {
    const publications = await client.prisma.publication.findMany({
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
                    publicationToRef: {
                        versions: {
                            some: {
                                isLatestLiveVersion: true
                            }
                        }
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

export const deleteOpenSearchRecord = (publicationId: string) =>
    client.search.delete({ index: 'publications', id: publicationId });

export const getOpenSearchPublications = async (filters: I.OpenSearchPublicationFilters) => {
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

    const publications = await client.search.search(query);

    return publications;
};

export const create = async (e: I.CreatePublicationRequestBody, user: I.User, doiResponse: I.DOIResponse) => {
    const publication = await client.prisma.publication.create({
        data: {
            id: doiResponse.data.attributes.suffix,
            doi: doiResponse.data.attributes.doi,
            type: e.type,
            // Create first version when publication is created
            versions: {
                create: {
                    id: doiResponse.data.attributes.suffix + '-v1',
                    versionNumber: 1,
                    title: e.title,
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
                    user: {
                        connect: {
                            id: user.id
                        }
                    },
                    publicationStatus: {
                        create: {
                            status: 'DRAFT'
                        }
                    },
                    coAuthors: {
                        // add main author to authors list
                        create: {
                            linkedUser: user.id,
                            email: user.email || '',
                            confirmedCoAuthor: true,
                            approvalRequested: false
                        }
                    },
                    topics: e.topicIds?.length
                        ? {
                              connect: e.topicIds.map((topicId) => ({ id: topicId }))
                          }
                        : undefined
                }
            }
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
            }
        }
    });

    return publication;
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
    const types = Helpers.octopusInformation.publications;
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
                   "Links"."publicationFrom" "childPublication",
                   "Links"."publicationTo" "id",
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
              ON "pfrom".id = "Links"."publicationFrom"

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "Links"."publicationTo"

              LEFT JOIN "PublicationVersion" AS pto_version
              ON "pto".id = "pto_version"."versionOf"
              AND "pto_version"."isLatestLiveVersion" = TRUE

              LEFT JOIN "User" AS pto_user
              ON "pto_version"."createdBy" = "pto_user"."id"

            WHERE "Links"."publicationFrom" = ${id}

            UNION ALL

            SELECT l."id" "linkId",
                   l."publicationFrom" "childPublication",
                   l."publicationTo" "id",
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
              ON to_left."id" = l."publicationFrom"

              LEFT JOIN "Publication" AS pfrom
              ON "pfrom".id = "l"."publicationFrom"

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "l"."publicationTo"

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
                   "Links"."publicationFrom" "id",
                   "Links"."publicationTo" "parentPublication",
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
              ON "pfrom".id = "Links"."publicationFrom"

              LEFT JOIN "PublicationVersion" AS pfrom_version
              ON "pfrom".id = "pfrom_version"."versionOf"
              AND "pfrom_version"."isLatestLiveVersion" = TRUE

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "Links"."publicationTo"

              LEFT JOIN "User" AS pfrom_user
              ON "pfrom_version"."createdBy" = "pfrom_user"."id"

            WHERE "Links"."publicationTo" = ${id}

            UNION ALL

            SELECT l."id" "linkId",
                   l."publicationFrom" "id",
                   l."publicationTo" "parentPublication",
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
              ON to_right."id" = l."publicationTo"

              LEFT JOIN "Publication" AS pfrom
              ON "pfrom".id = "l"."publicationFrom"

              LEFT JOIN "PublicationVersion" AS pfrom_version
              ON "pfrom".id = "pfrom_version"."versionOf"
              AND "pfrom_version"."isLatestLiveVersion" = TRUE

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "l"."publicationTo"

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

    // Sorting - this is a custom order to make the visualisation neater.
    // Process parents by type, proceeding away from the selected publication's type.
    const filteredPublicationTypes = Helpers.octopusInformation.publications.filter((type) => type !== 'PEER_REVIEW');
    const orderedParents: I.LinkedToPublication[] = [];
    let parentTypeIdx = filteredPublicationTypes.indexOf(publication.type) - 1;

    // For each type, going backwards towards PROBLEM, starting with the one before the selected publication's type...
    while (parentTypeIdx >= 0) {
        const type = filteredPublicationTypes[parentTypeIdx];
        const publicationsOfType = linkedTo.filter((linkedPublication) => linkedPublication.type === type);

        // Sort parents.
        // For the type immediately before the selected publication's type, just order parents by publication date, descending.
        if (parentTypeIdx === filteredPublicationTypes.indexOf(publication.type) - 1) {
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
    let childTypeIdx = filteredPublicationTypes.indexOf(publication.type) + 1;

    // For each type, going forwards towards REAL_WORLD_APPLICATION, starting with the one after the selected publication's type...
    while (childTypeIdx <= filteredPublicationTypes.indexOf('REAL_WORLD_APPLICATION')) {
        const type = filteredPublicationTypes[childTypeIdx];
        const publicationsOfType = linkedFrom.filter((linkedPublication) => linkedPublication.type === type);

        // Sort child publications.
        // For the type immediately after the selected publication's type, just order children by publication date, descending.
        if (childTypeIdx === filteredPublicationTypes.indexOf(publication.type) + 1) {
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
                    lastName: author.user?.lastName || ''
                }
            }))
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
                    publicationToRef: {
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
                    publicationToRef: {
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
                            }
                        }
                    }
                }
            },
            linkedFrom: {
                where: {
                    draft: includeDraftVersion ? undefined : includeDraftVersion,
                    publicationFromRef: {
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
                    publicationFromRef: {
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
                            }
                        }
                    }
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
        const { id: linkId, publicationToRef, draft } = link;
        const { id, type, versions, doi } = publicationToRef;
        const { createdBy, user, currentStatus, publishedDate, title } = versions[0];

        return {
            id,
            draft,
            linkId,
            type,
            doi,
            childPublication: publication.id,
            childPublicationType: publication.type,
            title: title || '',
            createdBy,
            authorFirstName: user.firstName,
            authorLastName: user.lastName || '',
            currentStatus,
            publishedDate: publishedDate?.toISOString() || '',
            authors: []
        };
    });

    const linkedFrom: I.LinkedFromPublication[] = publication.linkedFrom.map((link) => {
        const { id: linkId, publicationFromRef, draft } = link;
        const { id, type, versions, doi } = publicationFromRef;
        const { createdBy, user, currentStatus, publishedDate, title } = versions[0];

        return {
            id,
            draft,
            linkId,
            type,
            doi,
            parentPublication: publication.id,
            parentPublicationType: publication.type,
            title: title || '',
            createdBy,
            authorFirstName: user.firstName,
            authorLastName: user.lastName || '',
            currentStatus,
            publishedDate: publishedDate?.toISOString() || '',
            authors: []
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
                    lastName: author.user?.lastName || ''
                }
            }))
        },
        linkedTo,
        linkedFrom
    };
};

/**
 *
 * @TODO - move the PDF service to the publication versions when we start implementing creation of new versions
 */

// AWS Lambda + Puppeteer walkthrough -  https://medium.com/@keshavkumaresan/generating-pdf-documents-within-aws-lambda-with-nodejs-and-puppeteer-46ac7ca299bf
export const generatePDF = async (publicationVersion: I.PublicationVersion): Promise<string | null> => {
    const references = await referenceService.getAllByPublicationVersion(publicationVersion.id);
    const { linkedTo } = await getDirectLinksForPublication(publicationVersion.versionOf);
    const htmlTemplate = Helpers.createPublicationHTMLTemplate(publicationVersion, references, linkedTo);
    const isLocal = process.env.STAGE === 'local';

    let browser: Browser | null = null;

    try {
        chromium.setGraphicsMode = false;

        browser = await launch({
            args: [...chromium.args, '--font-render-hinting=none'],
            executablePath: isLocal ? (await import('puppeteer')).executablePath() : await chromium.executablePath(),
            headless: chromium.headless
        });

        console.log('Browser opened!');

        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
        await page.setContent(htmlTemplate, {
            waitUntil: htmlTemplate.includes('<img') ? ['load', 'networkidle0'] : undefined
        });

        const pdf = await page.pdf({
            format: 'a4',
            preferCSSPageSize: true,
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: Helpers.createPublicationHeaderTemplate(publicationVersion),
            footerTemplate: Helpers.createPublicationFooterTemplate(publicationVersion)
        });

        // upload pdf to S3
        await s3.client.send(
            new PutObjectCommand({
                Bucket: s3.buckets.pdfs,
                Key: `${publicationVersion.versionOf}.pdf`,
                ContentType: 'application/pdf',
                Body: pdf
            })
        );

        console.log('Successfully generated PDF for publicationId: ', publicationVersion.versionOf);

        return `${s3.endpoint}/${s3.buckets.pdfs}/${publicationVersion.versionOf}.pdf`;
    } catch (err) {
        console.error(err);

        return null;
    } finally {
        if (browser) {
            // close all pages
            for (const page of await browser.pages()) {
                await page.close();
            }

            // close browser
            await browser.close();
            console.log('Browser closed!');
        }
    }
};
