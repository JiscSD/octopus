import chromium from '@sparticuz/chromium';
import { Prisma } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';
import { Browser, launch } from 'puppeteer-core';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import * as client from 'lib/client';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as publicationService from 'publication/service';
import * as referenceService from 'reference/service';
import * as s3 from 'lib/s3';

const defaultPublicationVersionInclude = {
    publication: {
        select: {
            id: true,
            type: true,
            doi: true,
            url_slug: true
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
            description: true
        }
    }
} satisfies Prisma.PublicationVersionInclude;

export const getById = (id: string) =>
    client.prisma.publicationVersion.findFirst({
        where: {
            id
        },
        include: defaultPublicationVersionInclude
    });

export const get = (publicationId: string, version: string | number) =>
    client.prisma.publicationVersion.findFirst({
        where: {
            versionOf: publicationId,
            ...(typeof version === 'number' || Number(version)
                ? { versionNumber: Number(version) }
                : version === 'latest'
                ? { isLatestVersion: true }
                : version === 'latestLive'
                ? {
                      isLatestLiveVersion: true
                  }
                : { id: version })
        },
        include: defaultPublicationVersionInclude
    });

export const getAllByPublicationIds = async (ids: string[]) => {
    // Get latest versions of these publications
    const latestVersions = await client.prisma.publicationVersion.findMany({
        where: {
            versionOf: {
                in: ids
            },
            isLatestLiveVersion: true
        },
        include: {
            publication: {
                select: {
                    id: true,
                    type: true,
                    doi: true,
                    url_slug: true,
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
                    },
                    publicationFlags: {
                        where: {
                            resolved: false
                        }
                    }
                }
            },
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

    if (ids.length !== latestVersions.length) {
        throw Error('Unable to find all latest versions for all requested publications.');
    }

    // Provide counts
    const mappedResults = latestVersions.map((version) => {
        // Remove linkedFrom and flags from return
        const { linkedFrom, publicationFlags, ...rest } = version.publication;

        return {
            ...version,
            publication: {
                ...rest,
                flagCount: version.publication.publicationFlags.length,
                peerReviewCount: version.publication.linkedFrom.length
            }
        };
    });

    return mappedResults;
};

export const update = (id: string, data: Prisma.PublicationVersionUpdateInput) =>
    client.prisma.publicationVersion.update({
        where: {
            id
        },
        // Make sure updatedAt changes - only changing relations will not cause this otherwise.
        data: { ...data, updatedAt: new Date().toISOString() },
        include: defaultPublicationVersionInclude
    });

export const updateStatus = async (id: string, status: I.PublicationStatusEnum) => {
    const updatedVersion = await client.prisma.publicationVersion.update({
        where: {
            id
        },
        data: {
            currentStatus: status,
            publicationStatus: {
                create: {
                    status
                }
            },
            ...(status === 'LIVE' && {
                publishedDate: new Date().toISOString(),
                isLatestLiveVersion: true
            })
        },
        include: defaultPublicationVersionInclude
    });

    const publication = await client.prisma.publication.findUnique({
        where: { id: updatedVersion.versionOf },
        select: { type: true }
    });

    if (status === 'LIVE') {
        if (publication?.type === 'PEER_REVIEW') {
            // Check if any links created from this version have had the TO publication get a new live version since link creation.
            // If so, alter the link to point to this new latest live version.
            const outdatedDraftLinks = await client.prisma.links.findMany({
                where: {
                    publicationFromId: updatedVersion.versionOf,
                    draft: true,
                    versionTo: {
                        isLatestLiveVersion: false
                    }
                }
            });

            for (const outdatedDraftLink of outdatedDraftLinks) {
                const latestVersionTo = await client.prisma.publicationVersion.findFirst({
                    where: {
                        versionOf: outdatedDraftLink.publicationToId,
                        isLatestLiveVersion: true
                    }
                });

                if (latestVersionTo) {
                    await client.prisma.links.update({
                        where: {
                            id: outdatedDraftLink.id
                        },
                        data: {
                            versionToId: latestVersionTo.id
                        }
                    });
                }
            }
        }

        // Update "draft" links.
        await client.prisma.links.updateMany({
            where: {
                publicationFromId: updatedVersion.versionOf,
                draft: true
            },
            data: {
                draft: false
            }
        });

        if (updatedVersion.versionNumber > 1) {
            // Update previous version's "isLatestLiveVersion" flag.
            await client.prisma.publicationVersion.updateMany({
                where: {
                    versionOf: updatedVersion.versionOf,
                    versionNumber: updatedVersion.versionNumber - 1
                },
                data: {
                    isLatestLiveVersion: false
                }
            });
        }
    }

    return updatedVersion;
};

export const validateConflictOfInterest = (version: I.PublicationVersion) => {
    if (version.conflictOfInterestStatus) {
        if (!version.conflictOfInterestText?.length) return false;
    } else if (version.conflictOfInterestStatus === null) {
        return false;
    }

    return true;
};

export const checkIsReadyToPublish = async (publicationVersion: I.PublicationVersion): Promise<boolean> => {
    if (!publicationVersion) {
        return false;
    }

    const { linkedTo } = await publicationService.getDirectLinksForPublication(publicationVersion.versionOf, true);

    const hasAtLeastOneLinkOrTopic =
        linkedTo.length !== 0 ||
        (publicationVersion.publication.type === 'PROBLEM' && publicationVersion.topics.length !== 0);
    const hasFilledRequiredFields =
        ['title', 'licence'].every((field) => publicationVersion[field]) &&
        !Helpers.isEmptyContent(publicationVersion.content || '');
    const conflictOfInterest = validateConflictOfInterest(publicationVersion);
    const hasPublishDate = Boolean(publicationVersion.publishedDate);
    const isDataAndHasEthicalStatement =
        publicationVersion.publication.type === 'DATA' ? publicationVersion.ethicalStatement !== null : true;
    const isDataAndHasPermissionsStatement =
        publicationVersion.publication.type === 'DATA' ? publicationVersion.dataPermissionsStatement !== null : true;

    const coAuthorsAreVerified = !!publicationVersion.coAuthors.every(
        (coAuthor) => coAuthor.confirmedCoAuthor && (coAuthor.isIndependent || coAuthor.affiliations.length)
    );

    return (
        hasAtLeastOneLinkOrTopic &&
        hasFilledRequiredFields &&
        conflictOfInterest &&
        !hasPublishDate &&
        isDataAndHasEthicalStatement &&
        isDataAndHasPermissionsStatement &&
        coAuthorsAreVerified &&
        publicationVersion.isLatestVersion
    );
};

export const checkIsReadyToRequestApprovals = async (publicationVersion: I.PublicationVersion): Promise<boolean> => {
    if (!publicationVersion) {
        return false;
    }

    if (!publicationVersion.isLatestVersion || publicationVersion.currentStatus !== 'DRAFT') {
        return false;
    }

    const { linkedTo } = await publicationService.getDirectLinksForPublication(publicationVersion.versionOf, true);

    const hasAtLeastOneLinkOrTopic =
        linkedTo.length !== 0 ||
        (publicationVersion.publication.type === 'PROBLEM' && publicationVersion.topics.length !== 0);
    const hasFilledRequiredFields =
        ['title', 'licence'].every((field) => publicationVersion[field]) &&
        !Helpers.isEmptyContent(publicationVersion.content || '');
    const conflictOfInterest = validateConflictOfInterest(publicationVersion);
    const isDataAndHasEthicalStatement =
        publicationVersion.publication.type === 'DATA' ? publicationVersion.ethicalStatement !== null : true;
    const isDataAndHasPermissionsStatement =
        publicationVersion.publication.type === 'DATA' ? publicationVersion.dataPermissionsStatement !== null : true;
    const hasConfirmedAffiliations = !!publicationVersion.coAuthors.some(
        (author) =>
            author.linkedUser === publicationVersion.createdBy && (author.isIndependent || author.affiliations.length)
    );

    return (
        hasAtLeastOneLinkOrTopic &&
        hasFilledRequiredFields &&
        conflictOfInterest &&
        isDataAndHasEthicalStatement &&
        isDataAndHasPermissionsStatement &&
        hasConfirmedAffiliations &&
        publicationVersion.isLatestVersion
    );
};

export const checkIsReadyToLock = async (publicationVersion: I.PublicationVersion): Promise<boolean> => {
    if (!publicationVersion) {
        return false;
    }

    if (publicationVersion.currentStatus !== 'DRAFT') {
        return false;
    }

    const isReadyToRequestApprovals = await checkIsReadyToRequestApprovals(publicationVersion);
    const hasRequestedApprovals = !!publicationVersion.coAuthors.some((author) => author.approvalRequested);

    return isReadyToRequestApprovals && hasRequestedApprovals;
};

export const deleteVersion = async (publicationVersion: I.PublicationVersion) => {
    if (
        publicationVersion.isLatestVersion &&
        publicationVersion.versionNumber === 1 &&
        publicationVersion.currentStatus !== 'LIVE'
    ) {
        // if there's only one DRAFT version and that's the latest one, we can safely delete the entire publication
        await publicationService.deletePublication(publicationVersion.versionOf);
    } else {
        // delete this version
        await client.prisma.publicationVersion.delete({
            where: {
                id: publicationVersion.id
            }
        });

        // delete draft links for this version
        await client.prisma.links.deleteMany({
            where: {
                publicationFromId: publicationVersion.versionOf,
                draft: true
            }
        });

        // get previous version
        const previousVersion = await client.prisma.publicationVersion.findFirst({
            where: {
                versionOf: publicationVersion.versionOf,
                versionNumber: publicationVersion.versionNumber - 1
            },
            select: {
                id: true
            }
        });

        if (previousVersion) {
            // make the previous version "isLatestVersion=true"
            await client.prisma.publicationVersion.update({
                where: {
                    id: previousVersion.id
                },
                data: {
                    isLatestVersion: true
                }
            });
        }
    }
};

export const create = async (previousVersion: I.PublicationVersion, user: I.User) => {
    const newVersionNumber = previousVersion.versionNumber + 1;
    const previousVersionReferences = await referenceService.getAllByPublicationVersion(previousVersion.id);
    const previousVersionCoAuthors = previousVersion.coAuthors.map((coAuthor, index) =>
        coAuthor.linkedUser === user.id
            ? {
                  email: user.email ?? '',
                  linkedUser: user.id,
                  confirmedCoAuthor: true,
                  approvalRequested: false,
                  affiliations: coAuthor.affiliations as unknown[] as Prisma.InputJsonValue[],
                  isIndependent: coAuthor.isIndependent,
                  position: index
              }
            : {
                  email: coAuthor.email,
                  position: index
              }
    );

    if (!previousVersionCoAuthors.find((coAuthor) => coAuthor.linkedUser === user.id)) {
        // enforce adding the new corresponding author to coAuthors list - mainly used for seed data eg. tests..
        previousVersionCoAuthors.unshift({
            email: user.email ?? '',
            linkedUser: user.id,
            confirmedCoAuthor: true,
            approvalRequested: false,
            affiliations: [],
            isIndependent: false,
            position: 0
        });
    }

    // create new version based on the previous one
    const newPublicationVersion = await client.prisma.publicationVersion.create({
        data: {
            id: `${previousVersion.versionOf}-v${newVersionNumber}`,
            versionOf: previousVersion.versionOf,
            versionNumber: newVersionNumber,
            title: previousVersion.title,
            licence: previousVersion.licence,
            description: previousVersion.description,
            keywords: previousVersion.keywords,
            content: previousVersion.content,
            language: previousVersion.language,
            ethicalStatement: previousVersion.ethicalStatement,
            ethicalStatementFreeText: previousVersion.ethicalStatementFreeText,
            dataPermissionsStatement: previousVersion.dataPermissionsStatement,
            dataPermissionsStatementProvidedBy: previousVersion.dataPermissionsStatementProvidedBy,
            dataAccessStatement: previousVersion.dataAccessStatement,
            selfDeclaration: previousVersion.selfDeclaration,
            fundersStatement: previousVersion.fundersStatement,
            conflictOfInterestStatus: previousVersion.conflictOfInterestStatus,
            conflictOfInterestText: previousVersion.conflictOfInterestText,
            createdBy: user.id,
            publicationStatus: {
                create: {
                    status: 'DRAFT'
                }
            },
            coAuthors: {
                // add co authors from the previous version
                createMany: {
                    data: previousVersionCoAuthors
                }
            },
            // add topics from previous version
            topics: previousVersion.topics.length
                ? {
                      connect: previousVersion.topics.map((topic) => ({ id: topic.id }))
                  }
                : undefined,
            // add references from the previous version
            References: {
                createMany: {
                    data: previousVersionReferences.map((reference) => ({
                        id: createId(),
                        text: reference.text,
                        type: reference.type,
                        location: reference.location
                    }))
                }
            },
            // add funders from previous version
            funders: {
                createMany: {
                    data: previousVersion.funders.map((funder) => ({
                        ror: funder.ror,
                        city: funder.city,
                        country: funder.country,
                        link: funder.link,
                        name: funder.name,
                        grantId: funder.grantId
                    }))
                }
            },
            additionalInformation: {
                createMany: {
                    data: previousVersion.additionalInformation.map((additionalInformation) => ({
                        title: additionalInformation.title,
                        url: additionalInformation.url,
                        description: additionalInformation.description
                    }))
                }
            }
        },
        include: defaultPublicationVersionInclude
    });

    // change previous version "isLatestVersion" to false
    await client.prisma.publicationVersion.update({
        where: {
            id: previousVersion.id
        },
        data: {
            isLatestVersion: false
        }
    });

    return newPublicationVersion;
};

export const transferOwnership = (publicationVersionId: string, requesterId: string, requesterEmail: string) =>
    update(publicationVersionId, {
        user: {
            connect: {
                id: requesterId
            }
        },
        coAuthors: {
            // create/update the new corresponding author
            upsert: {
                create: {
                    email: requesterEmail,
                    confirmedCoAuthor: true,
                    linkedUser: requesterId
                },
                update: {
                    confirmedCoAuthor: true,
                    linkedUser: requesterId
                },
                where: {
                    publicationVersionId_email: {
                        email: requesterEmail,
                        publicationVersionId: publicationVersionId
                    }
                }
            }
        }
    });

// AWS Lambda + Puppeteer walkthrough -  https://medium.com/@keshavkumaresan/generating-pdf-documents-within-aws-lambda-with-nodejs-and-puppeteer-46ac7ca299bf
export const generatePDF = async (publicationVersion: I.PublicationVersion): Promise<string | null> => {
    const references = await referenceService.getAllByPublicationVersion(publicationVersion.id);
    const { linkedTo } = await publicationService.getDirectLinksForPublication(publicationVersion.versionOf);
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
        console.log('Page viewport set');
        await page.setContent(htmlTemplate, {
            waitUntil: htmlTemplate.includes('<img') ? ['load', 'networkidle0'] : undefined
        });
        console.log('Page content set');

        const pdf = await page.pdf({
            format: 'a4',
            preferCSSPageSize: true,
            printBackground: true,
            displayHeaderFooter: true,
            headerTemplate: Helpers.createPublicationHeaderTemplate(publicationVersion),
            footerTemplate: Helpers.createPublicationFooterTemplate(publicationVersion)
        });
        console.log('Page exported to PDF');

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
