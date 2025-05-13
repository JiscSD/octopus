import * as client from 'lib/client';
import * as coAuthorService from 'coAuthor/service';
import * as email from 'lib/email';
import * as Helpers from 'lib/helpers';
import * as I from 'lib/interface';
import * as publicationVersionService from 'publicationVersion/service';
import { Prisma } from '@prisma/client';

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

type LinksForInvalidCheck = {
    id: string;
    versionFrom: {
        createdBy: string;
        currentStatus: I.PublicationStatusEnum;
        isLatestVersion: boolean;
        id: string;
        title: string | null;
        user: {
            email: string | null;
        };
        versionOf: string;
    };
    versionTo: {
        coAuthors: {
            email: string;
            linkedUser: string | null;
        }[];
        versionNumber: number;
        isLatestVersion: boolean;
        isLatestLiveVersion: boolean;
    };
}[];

const deleteInvalidLinks = async (links: LinksForInvalidCheck) => {
    // For any draft links to this publication, delete them if the conditions for their creation
    // are no longer met.
    for (const link of links) {
        // If the "from" publication is still in draft/locked
        const versionFrom = link.versionFrom;

        if (
            (versionFrom.currentStatus === 'DRAFT' || versionFrom.currentStatus === 'LOCKED') &&
            versionFrom.isLatestVersion
        ) {
            const versionTo = link.versionTo;

            if (
                // And the "to" publication is a first-time version that hasn't gone live
                versionTo.isLatestVersion &&
                !versionTo.isLatestLiveVersion &&
                versionTo.versionNumber === 1 &&
                // And the corresponding author of the "from" publication is not a co-author of the "to" publication,
                // (for example, after updating co-authors or transferring ownership).
                // Unconfirmed coauthors are allowed to retain links - they are checked by email.
                !versionTo.coAuthors.some(
                    (coAuthor) =>
                        coAuthor.linkedUser === versionFrom.createdBy || coAuthor.email === versionFrom.user.email
                )
            ) {
                // Delete the link, because the corresponding author on the "from" has no permission to see the "to" draft.
                await deleteLink(link.id);

                // If the "from" publication was locked and now has no links, revert it to draft state.
                if (versionFrom.currentStatus === 'LOCKED') {
                    const linkCount = await client.prisma.links.count({
                        where: {
                            publicationFromId: versionFrom.versionOf
                        }
                    });

                    if (linkCount === 0) {
                        await Promise.all([
                            publicationVersionService.updateStatus(versionFrom.id, 'DRAFT'),
                            coAuthorService.resetCoAuthors(versionFrom.id)
                        ]);

                        if (versionFrom.user.email && versionFrom.title) {
                            await email.automaticUnlock({
                                correspondingAuthorEmail: versionFrom.user.email,
                                publication: {
                                    title: versionFrom.title,
                                    url: Helpers.getPublicationUrl(versionFrom.versionOf)
                                }
                            });
                        }
                    }
                }
            }
        }
    }
};

const flattenDraftLinkData = (
    links: {
        id: string;
        publicationFrom: {
            versions: {
                createdBy: string;
                currentStatus: I.PublicationStatusEnum;
                id: string;
                isLatestVersion: boolean;
                title: string | null;
                user: {
                    email: string | null;
                };
                versionOf: string;
            }[];
        };
        publicationTo: {
            versions: {
                coAuthors: {
                    email: string;
                    linkedUser: string | null;
                }[];
                versionNumber: number;
                isLatestVersion: boolean;
                isLatestLiveVersion: boolean;
            }[];
        };
    }[]
): LinksForInvalidCheck => {
    return links.map((link) => {
        return {
            id: link.id,
            versionFrom: link.publicationFrom.versions[0],
            versionTo: link.publicationTo.versions[0]
        };
    });
};

export const removeInvalidLinksForPublication = async (publicationId: string, direction?: 'to' | 'from') => {
    const directionFilter: Prisma.LinksWhereInput =
        direction === 'to'
            ? {
                  publicationToId: publicationId
              }
            : direction === 'from'
            ? {
                  publicationFromId: publicationId
              }
            : {
                  // If no direction is provided, get both.
                  OR: [
                      {
                          publicationToId: publicationId
                      },
                      {
                          publicationFromId: publicationId
                      }
                  ]
              };

    const draftLinksForPublication = await client.prisma.links.findMany({
        where: {
            draft: true,
            ...directionFilter,
            publicationTo: {
                versions: {
                    every: {
                        isLatestVersion: true,
                        OR: [{ currentStatus: 'DRAFT' }, { currentStatus: 'LOCKED' }],
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
                            OR: [{ currentStatus: 'DRAFT' }, { currentStatus: 'LOCKED' }]
                        },
                        select: {
                            createdBy: true,
                            currentStatus: true,
                            id: true,
                            isLatestVersion: true,
                            title: true,
                            user: {
                                select: {
                                    email: true
                                }
                            },
                            versionOf: true
                        }
                    }
                }
            },
            publicationTo: {
                select: {
                    versions: {
                        where: {
                            isLatestVersion: true,
                            OR: [{ currentStatus: 'DRAFT' }, { currentStatus: 'LOCKED' }],
                            versionNumber: 1
                        },
                        select: {
                            isLatestVersion: true,
                            isLatestLiveVersion: true,
                            versionNumber: true,
                            coAuthors: {
                                select: {
                                    email: true,
                                    linkedUser: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    await deleteInvalidLinks(flattenDraftLinkData(draftLinksForPublication));
};

export const markForDeletion = (linkId: string, toDelete: boolean) =>
    client.prisma.links.update({
        where: {
            id: linkId
        },
        data: {
            pendingDeletion: toDelete
        }
    });
