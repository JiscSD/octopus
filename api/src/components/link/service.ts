import * as client from 'lib/client';
import * as publicationVersionService from 'publicationVersion/service';

export const create = async (fromPublicationId: string, toPublicationId: string) => {
    const link = await client.prisma.links.create({
        data: {
            publicationFrom: fromPublicationId,
            publicationTo: toPublicationId
        }
    });

    const latestVersionFrom = await client.prisma.publicationVersion.findFirst({
        where: {
            versionOf: fromPublicationId,
            isLatestVersion: true
        },
        select: { id: true }
    });

    if (latestVersionFrom) {
        await publicationVersionService.update(latestVersionFrom.id, {
            updatedAt: new Date().toISOString()
        });
    }

    return link;
};

export const doesLinkExist = async (fromPublicationId: string, toPublicationId: string) => {
    const link = await client.prisma.links.findFirst({
        where: {
            publicationFrom: fromPublicationId,
            publicationTo: toPublicationId
        }
    });

    return link;
};

export const deleteLink = async (id: string) => {
    const link = await client.prisma.links.findFirst({
        where: {
            id
        },
        select: {
            publicationFromRef: {
                select: {
                    id: true
                }
            }
        }
    });
    const latestVersionFrom = await client.prisma.publicationVersion.findFirst({
        where: { versionOf: link?.publicationFromRef.id, isLatestVersion: true },
        select: { id: true }
    });
    const deletedLink = await client.prisma.links.delete({
        where: {
            id
        }
    });

    if (latestVersionFrom) {
        await publicationVersionService.update(latestVersionFrom?.id, {
            updatedAt: new Date().toISOString()
        });
    }

    return deletedLink;
};

export const get = async (id: string) => {
    const link = await client.prisma.links.findFirst({
        include: {
            publicationFromRef: {
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
            publicationToRef: {
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

    return link;
};

export const canLinkBeCreatedBetweenPublicationTypes = (fromType, toType) => {
    const publicationTypes = [
        'PROBLEM',
        'HYPOTHESIS',
        'PROTOCOL',
        'DATA',
        'ANALYSIS',
        'INTERPRETATION',
        'REAL_WORLD_APPLICATION'
    ];

    // problems can link to anything
    if (fromType === 'PROBLEM') {
        return true;
    }

    // peer reviews can link to anything other than another peer review
    if (fromType === 'PEER_REVIEW' && toType !== 'PEER_REVIEW') {
        return true;
    }

    const fromIndex = publicationTypes.indexOf(fromType);
    const toIndex = publicationTypes.indexOf(toType);

    // fromIndex is the "next" publication type in the chain
    // if fromIndex is +1 of toIndex, fromState proceeds the toState
    if (fromIndex - toIndex === 1) {
        return true;
    }

    return false;
};
