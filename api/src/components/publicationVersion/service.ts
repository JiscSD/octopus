import { Prisma } from '@prisma/client';
import * as I from 'interface';
import * as client from 'lib/client';
import * as publicationService from 'publication/service';
import * as Helpers from 'lib/helpers';

export const getById = (id: string) =>
    client.prisma.publicationVersion.findFirst({
        where: {
            id
        },
        include: {
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
            topics: {
                select: {
                    id: true,
                    title: true,
                    createdAt: true
                }
            }
        }
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
        include: {
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
            topics: {
                select: {
                    id: true,
                    title: true,
                    createdAt: true
                }
            }
        }
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
                    url_slug: true
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

    return latestVersions;
};

export const update = (id: string, data: Prisma.PublicationVersionUpdateInput) =>
    client.prisma.publicationVersion.update({
        where: {
            id
        },
        data,
        include: {
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
            topics: {
                select: {
                    id: true,
                    title: true,
                    createdAt: true
                }
            }
        }
    });

export const updateStatus = async (id: string, status: I.PublicationStatusEnum) =>
    client.prisma.publicationVersion.update({
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
        }
    });

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
                publicationFrom: publicationVersion.versionOf,
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

// Overwrite existing topics with those whose IDs were passed.
export const updateTopics = async (id: string, topics: string[]) => {
    // Format topics in a way that prisma can understand.
    const topicsUpdateInput = { set: topics.map((topicId) => ({ id: topicId })) };

    const updateTopics = await client.prisma.publicationVersion.update({
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

export const getTopics = (id: string) =>
    client.prisma.topic.findMany({
        where: {
            publicationVersions: {
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
