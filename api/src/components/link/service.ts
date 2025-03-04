import * as client from 'lib/client';
import * as I from 'lib/interface';
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

const deleteInvalidLinks = async (
    links: {
        id: string;
        versionFrom: {
            isLatestVersion: boolean;
            createdBy: string;
            currentStatus: I.PublicationStatusEnum;
        };
        versionTo: {
            coAuthors: {
                linkedUser: string | null;
            }[];
            versionNumber: number;
            isLatestVersion: boolean;
            currentStatus: I.PublicationStatusEnum;
        };
    }[]
) => {
    // For any draft links to this publication, delete them if the conditions for their creation
    // are no longer met.
    for (const link of links) {
        // If the "from" publication is still in draft
        const versionFrom = link.versionFrom;

        if (versionFrom.currentStatus === 'DRAFT' && versionFrom.isLatestVersion) {
            const versionTo = link.versionTo;

            if (
                // And the "to" publication is a first-time draft
                versionTo.currentStatus === 'DRAFT' &&
                versionTo.isLatestVersion &&
                versionTo.versionNumber === 1 &&
                // And the corresponding author of the "from" publication is not a co-author of the "to" publication,
                // (for example, after updating co-authors or transferring ownership)
                !versionTo.coAuthors.some((coAuthor) => coAuthor.linkedUser === versionFrom.createdBy)
            ) {
                // Delete the link, because the corresponding author on the "from" has no permission to see the "to" draft.
                await deleteLink(link.id);
            }
        }
    }
};

const flattenDraftLinkData = (
    links: {
        id: string;
        publicationFrom: {
            versions: {
                isLatestVersion: boolean;
                createdBy: string;
                currentStatus: I.PublicationStatusEnum;
            }[];
        };
        publicationTo: {
            versions: {
                coAuthors: {
                    linkedUser: string | null;
                }[];
                versionNumber: number;
                isLatestVersion: boolean;
                currentStatus: I.PublicationStatusEnum;
            }[];
        };
    }[]
) => {
    return links.map((link) => {
        return {
            id: link.id,
            versionFrom: link.publicationFrom.versions[0],
            versionTo: link.publicationTo.versions[0]
        };
    });
};

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

    await deleteInvalidLinks(flattenDraftLinkData(draftLinksToPublication));
};

export const removeInvalidLinksFromPublication = async (publicationFromId: string) => {
    const draftLinksFromPublication = await client.prisma.links.findMany({
        where: {
            draft: true,
            publicationFromId,
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

    await deleteInvalidLinks(flattenDraftLinkData(draftLinksFromPublication));
};
