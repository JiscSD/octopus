import * as s3 from 'lib/s3';
import chromium from '@sparticuz/chromium';
import * as I from 'interface';
import * as client from 'lib/client';
import * as referenceService from 'reference/service';
import * as Helpers from 'lib/helpers';
import { Prisma } from '@prisma/client';
import { Browser, launch } from 'puppeteer-core';
import { PutObjectCommand } from '@aws-sdk/client-s3';

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
                    }
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
            },
            topics: {
                select: {
                    id: true,
                    title: true,
                    language: true,
                    translations: true
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

export const getOpenSearchPublications = async (filters: I.OpenSearchPublicationFilters) => {
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
                    }
                }
            },
            topics: e.topicIds?.length
                ? {
                      connect: e.topicIds.map((topicId) => ({ id: topicId }))
                  }
                : undefined
        },
        include: {
            topics: true,
            versions: true
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

export const getLinksForPublication = async (id: string): Promise<I.PublicationWithLinks> => {
    const publication = await get(id);

    if (!publication) {
        return {
            publication: null,
            linkedFrom: [],
            linkedTo: []
        };
    }

    const latestLiveVersion = publication?.versions.find((version) => version.isLatestLiveVersion);

    if (!latestLiveVersion) {
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
        
        SELECT * FROM to_left
        WHERE "type" != "childPublicationType"
            AND CAST("type" AS text) != ${publication?.type}
            AND "currentStatus" = 'LIVE';
    `;

    const linkedFrom = await client.prisma.$queryRaw<I.LinkedFromPublication[]>`
        WITH RECURSIVE to_right AS (
            SELECT "Links"."id" "linkId",
                   "Links"."publicationFrom" "id",
                   "Links"."publicationTo" "parentPublication",
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
              AND "pfrom_version"."isLatestVersion" = TRUE

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "Links"."publicationTo"

              LEFT JOIN "User" AS pfrom_user
              ON "pfrom_version"."createdBy" = "pfrom_user"."id"

            WHERE "Links"."publicationTo" = ${id}

            UNION ALL

            SELECT l."id" "linkId",
                   l."publicationFrom" "id",
                   l."publicationTo" "parentPublication",
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
              AND "pfrom_version"."isLatestVersion" = TRUE

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "l"."publicationTo"

              LEFT JOIN "User" AS pfrom_user
              ON "pfrom_version"."createdBy" = "pfrom_user"."id"

              WHERE "pto"."type" != 'PROBLEM'
        )
        SELECT *
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

export const getDirectLinksForPublication = async (
    id: string,
    includeDraft = false
): Promise<I.PublicationWithLinks> => {
    const publicationFilter: Prisma.PublicationVersionWhereInput = includeDraft
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
                            doi: true,
                            type: true,
                            versions: {
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
                            doi: true,
                            type: true,
                            versions: {
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
        const { id: linkId, publicationToRef } = link;
        const { id, type, versions, doi } = publicationToRef;
        const { createdBy, user, currentStatus, publishedDate, title } = versions[0];

        return {
            id,
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
        const { id: linkId, publicationFromRef } = link;
        const { id, type, versions, doi } = publicationFromRef;
        const { createdBy, user, currentStatus, publishedDate, title } = versions[0];

        return {
            id,
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
                Bucket: `science-octopus-publishing-pdfs-${process.env.STAGE}`,
                Key: `${publicationVersion.versionOf}.pdf`,
                ContentType: 'application/pdf',
                Body: pdf
            })
        );

        console.log('Successfully generated PDF for publicationId: ', publicationVersion.versionOf);

        return `${s3.endpoint}/science-octopus-publishing-pdfs-${process.env.STAGE}/${publicationVersion.versionOf}.pdf`;
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

export const getResearchTopics = async (additionalFilters: Prisma.PublicationWhereInput = {}) => {
    const publications = await client.prisma.publication.findMany({
        where: {
            type: 'PROBLEM',
            OR: [
                {
                    id: {
                        equals: 'why' // god problem will be converted to a god topic
                    }
                },
                {
                    versions: {
                        some: {
                            isLatestVersion: true,
                            content: {
                                contains: 'This is an automatically-generated topic'
                            }
                        }
                    }
                }
            ],
            versions: {
                some: {
                    createdBy: 'octopus',
                    isLatestVersion: true,
                    References: {
                        none: {}
                    }
                }
            },
            ...additionalFilters
        },
        include: {
            versions: {
                where: {
                    isLatestVersion: true
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            orcid: true
                        }
                    }
                }
            },
            linkedTo: {
                select: {
                    id: true,
                    publicationToRef: {
                        select: {
                            id: true,
                            type: true,
                            doi: true,
                            versions: {
                                select: {
                                    user: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            orcid: true
                                        }
                                    },
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
                select: {
                    id: true,
                    publicationFromRef: {
                        select: {
                            id: true,
                            type: true,
                            doi: true,
                            versions: {
                                select: {
                                    user: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            orcid: true
                                        }
                                    },
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
            PublicationBookmarks: true
        }
    });

    // Merge versioned data into the publication records
    const mergedPublications = publications.map((publication) => {
        const currentVersion = publication.versions[0];

        return { ...currentVersion, ...publication };
    });

    return mergedPublications;
};

// Overwrite existing topics with those whose IDs were passed.
export const updateTopics = async (id: string, topics: string[]) => {
    // Format topics in a way that prisma can understand.
    const topicsUpdateInput = { set: topics.map((topicId) => ({ id: topicId })) };

    const updateTopics = await client.prisma.publication.update({
        where: {
            id
        },
        data: {
            topics: topicsUpdateInput
        },
        include: {
            topics: true
        }
    });

    return updateTopics.topics;
};

export const getPublicationTopics = (id: string) =>
    client.prisma.topic.findMany({
        where: {
            publications: {
                some: {
                    id
                }
            }
        },
        select: {
            id: true,
            createdAt: true,
            title: true
        }
    });
