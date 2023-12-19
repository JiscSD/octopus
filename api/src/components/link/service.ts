import * as client from 'lib/client';

export const create = async (fromPublicationId: string, toPublicationId: string) => {
    const link = await client.prisma.links.create({
        data: {
            publicationFrom: fromPublicationId,
            publicationTo: toPublicationId
        }
    });

    await client.prisma.publicationVersion.updateMany({
        where: {
            versionOf: fromPublicationId,
            isLatestVersion: true
        },
        data: {
            updatedAt: new Date().toISOString()
        }
    });

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
    const deletedLink = await client.prisma.links.delete({
        where: {
            id
        }
    });
    await client.prisma.publicationVersion.updateMany({
        where: {
            versionOf: link?.publicationFromRef.id,
            isLatestVersion: true
        },
        data: {
            updatedAt: new Date().toISOString()
        }
    });

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
