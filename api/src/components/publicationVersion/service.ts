import nodemailer from 'nodemailer';
import { convert } from 'html-to-text';
import { createId } from '@paralleldrive/cuid2';
import { Prisma } from '@prisma/client';
import * as notificationBulletin from 'notification/bulletin';
import * as client from 'lib/client';
import * as doi from 'lib/doi';
import * as email from 'lib/email';
import * as eventService from 'event/service';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as publicationService from 'publication/service';
import * as pubRouterService from 'pubRouter/service';
import * as referenceService from 'reference/service';
import * as sqs from 'lib/sqs';

export const defaultPublicationVersionInclude = {
    publication: {
        select: {
            id: true,
            type: true,
            doi: true,
            url_slug: true,
            externalId: true,
            externalSource: true
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
            retainApproval: true,
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

type PrivatePublicationVersionInclude = typeof defaultPublicationVersionInclude & {
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
const privatePublicationVersionInclude: PrivatePublicationVersionInclude = structuredClone(
    defaultPublicationVersionInclude
);
privatePublicationVersionInclude.user.select.email = true;
privatePublicationVersionInclude.coAuthors.select.email = true;

export const getById = (id: string) =>
    client.prisma.publicationVersion.findFirst({
        where: {
            id
        },
        include: defaultPublicationVersionInclude
    });

export const privateGetById = (id: string) =>
    client.prisma.publicationVersion.findFirst({
        where: {
            id
        },
        include: privatePublicationVersionInclude
    });

const getVersionFilter = (versionFilter: string) => ({
    ...(typeof versionFilter === 'number' || Number(versionFilter)
        ? { versionNumber: Number(versionFilter) }
        : versionFilter === 'latest'
        ? { isLatestVersion: true }
        : versionFilter === 'latestLive'
        ? {
              isLatestLiveVersion: true
          }
        : { id: versionFilter })
});

export const get = (publicationId: string, versionFilter: string) =>
    client.prisma.publicationVersion.findFirst({
        where: {
            versionOf: publicationId,
            ...getVersionFilter(versionFilter)
        },
        include: defaultPublicationVersionInclude
    });

// Get a publication version including fields that shouldn't be exposed in an API response.
export const privateGet = (publicationId: string, versionFilter: string) =>
    client.prisma.publicationVersion.findFirst({
        where: {
            versionOf: publicationId,
            ...getVersionFilter(versionFilter)
        },
        include: privatePublicationVersionInclude
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
                    confirmedCoAuthor: true,
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

export const getAllForReporting = async (options: I.GetPublicationVersionsReportingOptions) => {
    const where: Prisma.PublicationVersionWhereInput = {
        currentStatus: 'LIVE',
        user: {
            NOT: {
                id: 'octopus'
            }
        },
        ...(options.dateFrom && options.dateTo
            ? {
                  AND: [
                      {
                          publishedDate: {
                              gte: new Date(options.dateFrom)
                          }
                      },
                      {
                          publishedDate: {
                              lte: new Date(options.dateTo)
                          }
                      }
                  ]
              }
            : options.dateTo
            ? {
                  publishedDate: {
                      lte: new Date(options.dateTo)
                  }
              }
            : options.dateFrom
            ? {
                  publishedDate: {
                      gte: new Date(options.dateFrom)
                  }
              }
            : {}),
        ...(options.authorType === 'individual' && {
            user: {
                role: 'USER'
            }
        }),
        ...(options.authorType === 'organisational' && {
            user: {
                role: 'ORGANISATION'
            }
        })
    };

    const [publicationVersions, total] = await Promise.all([
        client.prisma.publicationVersion.findMany({
            where,
            select: {
                doi: true,
                publishedDate: true,
                versionNumber: true,
                publication: {
                    select: {
                        doi: true,
                        type: true
                    }
                }
            },
            skip: options.offset,
            take: options.limit
        }),
        client.prisma.publicationVersion.count({ where })
    ]);

    return {
        data: publicationVersions,
        metadata: {
            total,
            limit: options.limit,
            offset: options.offset
        }
    };
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

export const validateConflictOfInterest = <
    // Use generic so this can be run on incoming request bodies for validation as well.
    T extends { conflictOfInterestStatus?: boolean | null; conflictOfInterestText?: string | null }
>(
    version: T
) => {
    if (version.conflictOfInterestStatus) {
        if (!version.conflictOfInterestText?.length) return false;
    } else if (version.conflictOfInterestStatus === null) {
        return false;
    }

    return true;
};

type ReadyCheckResult = {
    ready: boolean;
    message: string;
};

export const checkIsReadyToPublish = async (publicationVersion: I.PublicationVersion): Promise<ReadyCheckResult> => {
    if (!publicationVersion) {
        return { ready: false, message: 'Publication version not found' };
    }

    const { linkedTo } = await publicationService.getDirectLinksForPublication(
        publicationVersion.versionOf,
        null,
        true
    );

    // Are any linked publications not live?
    if (!linkedTo.every((linkedPublication) => linkedPublication.currentStatus === 'LIVE')) {
        return {
            ready: false,
            message:
                'One or more linked publications are still in draft. Please ensure all linked publications are live before publishing this one.'
        };
    }

    // Are there any links (to publications, or topics if publication is a problem)?
    const isProblem = publicationVersion.publication.type === 'PROBLEM';
    const isProblemWithTopics = isProblem && publicationVersion.topics.length !== 0;

    if (!isProblemWithTopics) {
        if (!linkedTo.length) {
            return {
                ready: false,
                message: `This publication must be linked to a live publication ${
                    isProblem ? 'or topic ' : ''
                } in order to publish.`
            };
        }

        // Would publishing leave any valid links (if some are pending deletion)?
        if (linkedTo.length && linkedTo.every((linkedPublication) => linkedPublication.pendingDeletion === true)) {
            return {
                ready: false,
                message:
                    'This publication would be left with no valid links if it was published. Please ensure there is at least one link to a live publication that is not marked for deletion before publishing this publication.'
            };
        }
    }

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

    const ready =
        hasFilledRequiredFields &&
        conflictOfInterest &&
        !hasPublishDate &&
        isDataAndHasEthicalStatement &&
        isDataAndHasPermissionsStatement &&
        coAuthorsAreVerified &&
        publicationVersion.isLatestVersion;

    return {
        ready,
        message: ready
            ? 'Publication is ready to publish.'
            : 'Publication is not ready to be made LIVE. Make sure all fields are filled in.'
    };
};

export const checkIsReadyToRequestApprovals = async (
    publicationVersion: I.PublicationVersion
): Promise<ReadyCheckResult> => {
    if (!publicationVersion) {
        return {
            ready: false,
            message: 'Publication version not found.'
        };
    }

    if (!publicationVersion.isLatestVersion || publicationVersion.currentStatus !== 'DRAFT') {
        return {
            ready: false,
            message: 'Publication is not an active draft.'
        };
    }

    const { linkedTo } = await publicationService.getDirectLinksForPublication(
        publicationVersion.versionOf,
        null,
        true
    );

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

    const ready =
        hasAtLeastOneLinkOrTopic &&
        hasFilledRequiredFields &&
        conflictOfInterest &&
        isDataAndHasEthicalStatement &&
        isDataAndHasPermissionsStatement &&
        hasConfirmedAffiliations &&
        publicationVersion.isLatestVersion;

    return {
        ready,
        message: ready ? 'Publication is ready to request approvals' : 'Make sure all fields are filled in.'
    };
};

export const checkIsReadyToLock = async (publicationVersion: I.PublicationVersion): Promise<ReadyCheckResult> => {
    const isReadyToRequestApprovals = await checkIsReadyToRequestApprovals(publicationVersion);

    if (isReadyToRequestApprovals.ready === false) {
        return {
            ready: false,
            message: 'Publication is not ready to be LOCKED. ' + isReadyToRequestApprovals.message
        };
    }

    const hasRequestedApprovals = !!publicationVersion.coAuthors.some((author) => author.approvalRequested);

    if (!hasRequestedApprovals) {
        return {
            ready: false,
            message: 'Please request approval before locking the publication.'
        };
    }

    return {
        ready: true,
        message: 'Publication is ready to be locked.'
    };
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

export const create = async (previousVersion: I.PrivatePublicationVersion, user: I.User) => {
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

const createBulletinNotifications = async (
    publicationVersion: I.PublicationVersion,
    previousVersion: I.PublicationVersion | null
) => {
    const excludedUserIds = publicationVersion.coAuthors
        .map((coAuthor) => coAuthor.linkedUser)
        .filter((i): i is string => i !== null);

    await Promise.all([
        // Notifies all users that bookmarked this publication version that a new version is now LIVE.
        notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_VERSION_CREATED,
            publicationVersion,
            previousVersion
        ),

        // Notify all users that red-flagged the previous publication version that a new version is now LIVE.
        notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_VERSION_RED_FLAG_RAISED,
            publicationVersion,
            previousVersion
        ),

        // Notifies authors that peer-reviewed the previous publication version that a new version is now LIVE.
        notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_VERSION_PEER_REVIEWED,
            publicationVersion,
            previousVersion
        ),

        // Notifies authors of PARENT publications (that link from this publication)
        notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_VERSION_LINKED_PREDECESSOR,
            publicationVersion,
            previousVersion,
            { excludedUserIds }
        ),

        // Notifies authors of CHILD publications (that link to the previous version of this publication)
        notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_VERSION_LINKED_SUCCESSOR,
            publicationVersion,
            previousVersion,
            { excludedUserIds }
        )
    ]);
};

// Actions that run after a version is published (changes status to LIVE).
// Pulled out to a separate function because things may need to run when something is
// published immediately (i.e. not going through full drafting workflow) and bypasses the updateStatus function.
export const postPublishHook = async (publicationVersion: I.PublicationVersion, skipPdfGeneration?: boolean) => {
    try {
        // Delete links pending deletion.
        await publicationService.deleteLinksPendingDeletion(publicationVersion.versionOf);

        // Tasks specific to peer reviews.
        if (publicationVersion.publication.type === 'PEER_REVIEW') {
            // Ensure links made from a PEER_REVIEW version point to the latest live version of the target publication.
            const linkedTo = await client.prisma.links.findMany({
                where: {
                    publicationFromId: publicationVersion.versionOf,
                    draft: true
                },
                select: {
                    id: true,
                    publicationToId: true,
                    publicationTo: {
                        select: {
                            doi: true
                        }
                    },
                    versionTo: {
                        include: defaultPublicationVersionInclude
                    }
                }
            });

            for (const link of linkedTo) {
                let reviewedVersion: I.PublicationVersion = link.versionTo;

                if (!link.versionTo.isLatestLiveVersion) {
                    // If the link is outdated (a newer version of the target publication exists),
                    // update the link to refer to the newest live version.
                    const latestVersionTo = await client.prisma.publicationVersion.findFirst({
                        where: {
                            versionOf: link.publicationToId,
                            isLatestLiveVersion: true
                        },
                        include: defaultPublicationVersionInclude
                    });

                    if (latestVersionTo) {
                        await client.prisma.links.update({
                            where: {
                                id: link.id
                            },
                            data: {
                                versionToId: latestVersionTo.id
                            }
                        });
                        reviewedVersion = latestVersionTo;
                    }
                }

                // Update canonical DOI of the reviewed publication to show the ReviewedBy relationship.
                await doi.updateRelatedIdentifiers('canonical', link.publicationTo.doi, reviewedVersion);
            }
        }

        // Update "draft" links.
        await client.prisma.links.updateMany({
            where: {
                publicationFromId: publicationVersion.versionOf,
                draft: true
            },
            data: {
                draft: false
            }
        });

        let previousVersion: I.PublicationVersion | null = null;

        if (publicationVersion.versionNumber > 1) {
            // Update previous version's "isLatestLiveVersion" flag.
            await client.prisma.publicationVersion.updateMany({
                where: {
                    versionOf: publicationVersion.versionOf,
                    versionNumber: publicationVersion.versionNumber - 1
                },
                data: {
                    isLatestLiveVersion: false
                }
            });

            // Get previous version to feed into DOI updates.
            previousVersion = await client.prisma.publicationVersion.findFirst({
                where: {
                    versionOf: publicationVersion.versionOf,
                    versionNumber: publicationVersion.versionNumber - 1
                },
                include: defaultPublicationVersionInclude
            });
        }

        let versionWithDOI: I.PublicationVersion | null = null;

        if (!Helpers.isPublicationExemptFromReversioning(publicationVersion.publication)) {
            // Generate a DOI for this version.
            const newDOIResponse = await doi.createPublicationVersionDOI(publicationVersion);
            const newDOI = newDOIResponse?.data.attributes.doi;

            // Update the DB record with the new DOI.
            versionWithDOI = await update(publicationVersion.id, {
                doi: newDOI
            });

            // Update the previous version's DOI to add a relationship to this one.
            if (previousVersion && previousVersion.doi) {
                await doi.updateRelatedIdentifiers('version', previousVersion.doi, previousVersion);
            }
        }

        // Update the canonical DOI with the latest details from this version.
        // If we have a version with a DOI, pass that, but if not just pass one without.
        await doi.updateCanonicalDOI(publicationVersion.publication.doi, versionWithDOI || publicationVersion);

        // Complete remaining tasks in parallel.
        const postDBUpdatePromises: Array<Promise<unknown>> = [];

        // Notifications
        postDBUpdatePromises.push(createBulletinNotifications(publicationVersion, previousVersion));

        // (Re)index publication in opensearch.
        postDBUpdatePromises.push(
            new Promise((resolve) => {
                // TODO: remove this extra logging if we don't observe ARI imports stalling here for some time.
                console.log(`Indexing publication ${publicationVersion.versionOf} in opensearch.`);
                publicationService
                    .upsertOpenSearchRecord({
                        id: publicationVersion.versionOf,
                        type: publicationVersion.publication.type,
                        title: publicationVersion.title,
                        organisationalAuthor: publicationVersion.user.role === 'ORGANISATION',
                        description: publicationVersion.description,
                        keywords: publicationVersion.keywords,
                        content: publicationVersion.content,
                        publishedDate: publicationVersion.publishedDate,
                        cleanContent: convert(publicationVersion.content)
                    })
                    .then((result) => {
                        console.log(`Indexing complete.`);
                        resolve(result);
                    })
                    .catch((error) => console.log(error));
            })
        );

        // Delete all pending request control events for this publication version.
        postDBUpdatePromises.push(
            eventService.deleteMany({
                type: 'REQUEST_CONTROL',
                data: {
                    path: ['publicationVersion', 'id'],
                    equals: publicationVersion.id
                }
            })
        );

        if (process.env.STAGE !== 'local') {
            if (!skipPdfGeneration) {
                // Send message to the pdf generation queue.
                // Skipped locally, as there is not an SQS queue in localstack.
                // Option to skip, e.g. in bulk import scripts, where instant pdf generation is not a priority.
                // In both cases, the pdf will still be generated the first time it's requested.
                postDBUpdatePromises.push(sqs.sendMessage(publicationVersion.versionOf));
            }

            if (publicationVersion.versionNumber === 1) {
                // Notify publications router of the publication if it has just been published for the first time.
                postDBUpdatePromises.push(pubRouterService.notifyPubRouter(publicationVersion));
            }
        }

        await Promise.all(postDBUpdatePromises);
    } catch (err) {
        console.log('Error in post-publish hook: ', err);
    }
};

const notifyLinkedAriOwners = async (publicationVersion: I.PrivatePublicationVersion): Promise<void> => {
    // Gather up ARI publications that have been newly linked from this publicationVersion.
    const newlyLinkedARIs = await client.prisma.publicationVersion.findMany({
        where: {
            isLatestLiveVersion: true,
            publication: {
                externalSource: 'ARI',
                linkedFrom: {
                    some: {
                        publicationFromId: publicationVersion.versionOf,
                        draft: true
                    }
                }
            }
        },
        select: {
            title: true,
            user: {
                select: {
                    email: true,
                    firstName: true
                }
            },

            versionOf: true
        }
    });

    const emailPromises: Promise<nodemailer.SentMessageInfo>[] = [];

    for (const ari of newlyLinkedARIs) {
        if (ari.user.email && publicationVersion.user.email) {
            emailPromises.push(
                email.newAriChildPublication({
                    ariPublication: {
                        author: {
                            email: ari.user.email,
                            name: ari.user.firstName
                        },
                        name: ari.title,
                        url: Helpers.getPublicationUrl(ari.versionOf)
                    },
                    childPublication: {
                        author: {
                            email: publicationVersion.user.email,
                            fullName: Helpers.getUserFullName(publicationVersion.user)
                        },
                        type: publicationVersion.publication.type,
                        url: Helpers.getPublicationUrl(publicationVersion.versionOf)
                    }
                })
            );
        }
    }

    await Promise.all(emailPromises);
};

export const updateStatus = async (id: string, status: I.PublicationStatusEnum, ariContactConsent?: boolean) => {
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

    if (status === 'LIVE') {
        // Important for this to come before postPublishHook because it needs to know which links are new
        // by looking at the draft field. The post publish hook will set "draft: false" on all new links.
        if (ariContactConsent) {
            // Author email is excluded from the return value of "update", and we need to include it in the email that is sent.
            const publicationWithEmail = await privateGet(updatedVersion.versionOf, 'latest');

            if (publicationWithEmail) {
                await notifyLinkedAriOwners(publicationWithEmail);
            }
        }

        await postPublishHook(updatedVersion);
    }

    return updatedVersion;
};

export const getPreviousPublishedVersion = async (publicationId: string): Promise<I.PublicationVersion | null> => {
    return client.prisma.publicationVersion.findFirst({
        where: {
            versionOf: publicationId,
            isLatestLiveVersion: false,
            currentStatus: 'LIVE'
        },
        orderBy: {
            publishedDate: 'desc'
        },
        include: defaultPublicationVersionInclude
    });
};
