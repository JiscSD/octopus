import * as s3 from 'lib/s3';
import chromium from '@sparticuz/chromium';
import * as I from 'interface';
import * as client from 'lib/client';
import * as referenceService from 'reference/service';
import * as Helpers from 'lib/helpers';
import { Links, Prisma } from '@prisma/client';
import { Browser, launch } from 'puppeteer-core';

import { PutObjectCommand } from '@aws-sdk/client-s3';

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
            },
            coAuthors: {
                select: {
                    id: true,
                    approvalRequested: true,
                    confirmedCoAuthor: true,
                    code: true,
                    linkedUser: true,
                    email: true,
                    publicationId: true,
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

    return publications;
};

export const update = async (id: string, updateContent: I.UpdatePublicationRequestBody) => {
    // Only if topics are passed, format them in a way that prisma can understand.
    // This will overwrite existing topics with those whose IDs were passed in updateContent.
    const { topics, ...dataRest } = updateContent;
    const data = {
        ...dataRest,
        ...(!!updateContent.topics && { topics: { set: updateContent.topics.map((topicId) => ({ id: topicId })) } })
    };

    const updatedPublication = await client.prisma.publication.update({
        where: {
            id
        },
        data
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

    return publication;
};

export const updateStatus = async (id: string, status: I.PublicationStatusEnum) => {
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

    if (status === 'LIVE') {
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
    } else if (publication.conflictOfInterestStatus === null) {
        return false;
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

export const isReadyToPublish = (publication: I.PublicationWithMetadata): boolean => {
    if (!publication) {
        return false;
    }

    const hasAtLeastOneLinkTo = publication.linkedTo.length !== 0;
    const hasFilledRequiredFields =
        ['title', 'licence'].every((field) => publication[field]) && !Helpers.isEmptyContent(publication.content || '');
    const conflictOfInterest = validateConflictOfInterest(publication);
    const hasPublishDate = Boolean(publication.publishedDate);
    const isDataAndHasEthicalStatement = publication.type === 'DATA' ? publication.ethicalStatement !== null : true;
    const isDataAndHasPermissionsStatement =
        publication.type === 'DATA' ? publication.dataPermissionsStatement !== null : true;

    const coAuthorsAreVerified = publication.coAuthors.every(
        (coAuthor) => coAuthor.confirmedCoAuthor && (coAuthor.isIndependent || coAuthor.affiliations.length)
    );

    return (
        hasAtLeastOneLinkTo &&
        hasFilledRequiredFields &&
        conflictOfInterest &&
        !hasPublishDate &&
        isDataAndHasEthicalStatement &&
        isDataAndHasPermissionsStatement &&
        coAuthorsAreVerified
    );
};

export const isReadyToRequestApproval = (publication: I.PublicationWithMetadata) => {
    if (!publication || publication.currentStatus !== 'DRAFT') {
        return false;
    }

    const hasAtLeastOneLinkTo = publication.linkedTo.length > 0;
    const hasFilledRequiredFields =
        ['title', 'licence'].every((field) => publication[field]) && !Helpers.isEmptyContent(publication.content || '');
    const conflictOfInterest = validateConflictOfInterest(publication);
    const isDataAndHasEthicalStatement = publication.type === 'DATA' ? publication.ethicalStatement !== null : true;
    const isDataAndHasPermissionsStatement =
        publication.type === 'DATA' ? publication.dataPermissionsStatement !== null : true;
    const hasConfirmedAffiliations = publication.coAuthors.some(
        (author) => author.linkedUser === publication.createdBy && (author.isIndependent || author.affiliations.length)
    );

    return (
        hasAtLeastOneLinkTo &&
        hasFilledRequiredFields &&
        conflictOfInterest &&
        isDataAndHasEthicalStatement &&
        isDataAndHasPermissionsStatement &&
        hasConfirmedAffiliations
    );
};

export const isReadyToLock = (publication: I.PublicationWithMetadata) => {
    if (!publication || publication.currentStatus !== 'DRAFT') {
        return false;
    }

    const hasRequestedApprovals = publication.coAuthors.some((author) => author.approvalRequested);

    return isReadyToRequestApproval(publication) && hasRequestedApprovals;
};

export const getLinksForPublication = async (id: string) => {
    const publication = await get(id);

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

    const linkedTo: Links[] = await client.prisma.$queryRaw`
        WITH RECURSIVE to_left AS (
            SELECT "Links"."publicationFrom" "childPublication",
                   "Links"."publicationTo" "id",
                   "pfrom".type "childPublicationType",
                   "pto".type,
                   "pto".title,
                   "pto"."createdBy",
                   "pto"."publishedDate",
                   "pto"."currentStatus",
                   "pto_user"."firstName" "authorFirstName",
                   "pto_user"."lastName" "authorLastName"

              FROM "Links"
              LEFT JOIN "Publication" AS pfrom
              ON "pfrom".id = "Links"."publicationFrom"

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "Links"."publicationTo"

              LEFT JOIN "User" AS pto_user
              ON "pto"."createdBy" = "pto_user"."id"

            WHERE "Links"."publicationFrom" = ${id}

            UNION ALL

            SELECT l."publicationFrom" "childPublication",
                   l."publicationTo" "id",
                   "pfrom".type "childPublicationType",
                   "pto".type,
                   "pto".title,
                   "pto"."createdBy",
                   "pto"."publishedDate",
                   "pto"."currentStatus",
                   "pto_user"."firstName" "authorFirstName",
                   "pto_user"."lastName" "authorLastName"

              FROM "Links" l
              JOIN to_left
              ON to_left."id" = l."publicationFrom"

              LEFT JOIN "Publication" AS pfrom
              ON "pfrom".id = "l"."publicationFrom"

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "l"."publicationTo"

              LEFT JOIN "User" AS pto_user
              ON "pto"."createdBy" = "pto_user"."id"
        )
        
        SELECT * FROM to_left
        WHERE "type" != "childPublicationType"
            AND CAST("type" AS text) != ${publication?.type}
            AND "currentStatus" = 'LIVE';
    `;

    const linkedFrom: Links[] = await client.prisma.$queryRaw`
        WITH RECURSIVE to_right AS (
            SELECT "Links"."publicationFrom" "id",
                   "Links"."publicationTo" "parentPublication",
                   "pfrom".type,
                   "pto".type "parentPublicationType",
                   "pfrom"."title",
                   "pfrom"."createdBy",
                   "pfrom"."publishedDate",
                   "pfrom"."currentStatus",
                   "pfrom_user"."firstName" "authorFirstName",
                   "pfrom_user"."lastName" "authorLastName"

              FROM "Links"
              LEFT JOIN "Publication" AS pfrom
              ON "pfrom".id = "Links"."publicationFrom"

              LEFT JOIN "Publication" AS pto
              ON "pto".id = "Links"."publicationTo"

              LEFT JOIN "User" AS pfrom_user
              ON "pfrom"."createdBy" = "pfrom_user"."id"

            WHERE "Links"."publicationTo" = ${id}

            UNION ALL

            SELECT l."publicationFrom" "id",
                   l."publicationTo" "parentPublication",
                   "pfrom".type,
                   "pto".type "parentPublicationType",
                   "pfrom"."title",
                   "pfrom"."createdBy",
                   "pfrom"."publishedDate",
                   "pfrom"."currentStatus",
                   "pfrom_user"."firstName" "authorFirstName",
                   "pfrom_user"."lastName" "authorLastName"
              FROM "Links" l
              JOIN to_right
              ON to_right."id" = l."publicationTo"

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
         WHERE "type" != "parentPublicationType"
           AND "type" != 'PROBLEM'
           AND "currentStatus" = 'LIVE';
    `;

    const linkedPublications = await client.prisma.publication.findMany({
        where: {
            id: {
                in: linkedTo.map((link) => link.id).concat(linkedFrom.map((link) => link.id))
            }
        },
        select: {
            id: true,
            coAuthors: {
                select: {
                    id: true,
                    linkedUser: true,
                    publicationId: true,
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
        },
        orderBy: {
            type: 'asc'
        }
    });

    // add authors to 'linkedTo' publications
    linkedTo.forEach((link) => {
        Object.assign(link, {
            authors: linkedPublications.find((publication) => publication.id === link.id)?.coAuthors || []
        });
    });

    // add authors to 'linkedFrom' publications
    linkedFrom.forEach((link) => {
        Object.assign(link, {
            authors: linkedPublications.find((publication) => publication.id === link.id)?.coAuthors || []
        });
    });

    return {
        publication,
        linkedTo,
        linkedFrom
    };
};

// AWS Lambda + Puppeteer walkthrough -  https://medium.com/@keshavkumaresan/generating-pdf-documents-within-aws-lambda-with-nodejs-and-puppeteer-46ac7ca299bf
export const generatePDF = async (publication: I.Publication & I.PublicationWithMetadata): Promise<string | null> => {
    const references = await referenceService.getAllByPublication(publication.id);
    const htmlTemplate = Helpers.createPublicationHTMLTemplate(publication, references);
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
            headerTemplate: Helpers.createPublicationHeaderTemplate(publication),
            footerTemplate: Helpers.createPublicationFooterTemplate(publication)
        });

        // upload pdf to S3
        await s3.client.send(
            new PutObjectCommand({
                Bucket: `science-octopus-publishing-pdfs-${process.env.STAGE}`,
                Key: `${publication.id}.pdf`,
                ContentType: 'application/pdf',
                Body: pdf
            })
        );

        console.log('Successfully generated PDF for publicationId: ', publication.id);

        return `${s3.endpoint}/science-octopus-publishing-pdfs-${process.env.STAGE}/${publication.id}.pdf`;
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

export const getResearchTopics = (additionalFilters: Prisma.PublicationWhereInput = {}) =>
    client.prisma.publication.findMany({
        where: {
            type: 'PROBLEM',
            createdBy: 'octopus',
            OR: [
                {
                    id: {
                        equals: 'why' // god problem will be converted to a god topic
                    }
                },
                {
                    content: {
                        contains: 'This is an automatically-generated topic'
                    }
                }
            ],
            References: {
                none: {}
            },
            ...additionalFilters
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    orcid: true
                }
            },
            linkedTo: {
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
            },
            PublicationBookmarks: true
        }
    });
