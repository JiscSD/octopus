import * as client from 'lib/client';
import * as publicationVersionService from 'publicationVersion/service';

export const create = async (fromPublicationId: string, toPublicationId: string, toVersionId: string) => {
    const link = await client.prisma.links.create({
        data: {
            publicationFromId: fromPublicationId,
            publicationToId: toPublicationId,
            versionToId: toVersionId
        }
    });

    const latestVersionFrom = await publicationVersionService.get(fromPublicationId, 'latest');

    if (latestVersionFrom) {
        await publicationVersionService.update(latestVersionFrom.id, {
            updatedAt: new Date().toISOString()
        });
    }

    return link;
};

export const doesLinkExist = (publicationFromId: string, publicationToId: string) =>
    client.prisma.links.findFirst({
        where: {
            publicationFromId,
            publicationToId
        }
    });

export const deleteLink = async (id: string) => {
    const link = await client.prisma.links.findFirst({
        where: {
            id
        },
        select: {
            publicationFromId: true
        }
    });
    const deletedLink = await client.prisma.links.delete({
        where: {
            id
        }
    });

    if (link) {
        const latestVersionFrom = await publicationVersionService.get(link.publicationFromId, 'latest');

        if (latestVersionFrom) {
            await publicationVersionService.update(latestVersionFrom.id, {
                updatedAt: new Date().toISOString()
            });
        }
    }

    return deletedLink;
};

export const get = (id: string) =>
    client.prisma.links.findFirst({
        include: {
            publicationFrom: {
                select: {
                    id: true,
                    versions: {
                        select: {
                            isLatestVersion: true,
                            currentStatus: true,
                            publicationStatus: true,
                            user: true
                        }
                    }
                }
            },
            publicationTo: {
                select: {
                    id: true,
                    versions: {
                        select: {
                            isLatestVersion: true,
                            currentStatus: true,
                            publicationStatus: true,
                            user: true
                        }
                    }
                }
            }
        },
        where: {
            id
        }
    });

export const removeInvalidLinksToPublication = async (publicationToId: string) => {
    const draftLinksToPublication = await client.prisma.links.findMany({
        where: {
            draft: true,
            publicationToId,
            publicationTo: {
                versions: {
                    every: {
                        isLatestVersion: true,
                        currentStatus: 'DRAFT',
                        versionNumber: 1
                    }
                }
            }
        },
        select: {
            id: true,
            publicationFrom: {
                select: {
                    versions: {
                        where: {
                            isLatestVersion: true,
                            currentStatus: 'DRAFT'
                        },
                        select: {
                            createdBy: true,
                            isLatestVersion: true,
                            currentStatus: true
                        }
                    }
                }
            },
            publicationTo: {
                select: {
                    versions: {
                        where: {
                            isLatestVersion: true,
                            currentStatus: 'DRAFT',
                            versionNumber: 1
                        },
                        select: {
                            isLatestVersion: true,
                            currentStatus: true,
                            versionNumber: true,
                            coAuthors: {
                                select: {
                                    linkedUser: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // For any draft links to this publication, delete them if the conditions for their creation
    // are no longer met.
    for (const link of draftLinksToPublication) {
        // If the "from" publication is still in draft
        const versionFrom = link.publicationFrom.versions[0];

        if (versionFrom.currentStatus === 'DRAFT' && versionFrom.isLatestVersion) {
            const versionTo = link.publicationTo.versions[0];

            if (
                // And the "to" publication is a first-time draft
                versionTo.currentStatus === 'DRAFT' &&
                versionTo.isLatestVersion &&
                versionTo.versionNumber === 1 &&
                // And the corresponding author of the "from" publication is not a co-author of the "to" publication,
                // (for example, after updating co-authors or transferring ownership)
                !link.publicationTo.versions[0].coAuthors.some(
                    (coAuthor) => coAuthor.linkedUser === link.publicationFrom.versions[0].createdBy
                )
            ) {
                // Delete the link, because the corresponding author on the "from" has no permission to see the "to" draft.
                await deleteLink(link.id);
            }
        }
    }
};
