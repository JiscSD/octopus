import * as client from 'lib/client';

export const create = async (fromPublicationId: string, toPublicationId: string, toPublicationVersionId: string) => {
    const link = await client.prisma.links.create({
        data: {
            publicationFrom: fromPublicationId,
            publicationTo: toPublicationId,
            linkToVersion: toPublicationVersionId
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
    const deletedLink = await client.prisma.links.delete({
        where: {
            id
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
                    user: true,
                    versions: {
                        where: {
                            isCurrent: true
                        },
                        select: {
                            currentStatus: true,
                            publicationStatus: true
                        }
                    }
                }
            },
            publicationToRef: {
                select: {
                    id: true,
                    user: true,
                    versions: {
                        select: {
                            currentStatus: true,
                            publicationStatus: true
                        }
                    }
                }
            }
        },
        where: {
            id
        }
    });

    if (!link || link.publicationFromRef.versions === undefined || link.publicationToRef.versions === undefined) {
        throw Error('Insufficient data to format full link');
    }

    // Put currentStatus and publicationStatus at level above for convenience
    const simplifiedLink = {
        ...link,
        publicationFromRef: {
            ...link?.publicationFromRef,
            currentStatus: link?.publicationFromRef.versions[0].currentStatus,
            publicationStatus: link?.publicationFromRef.versions[0].publicationStatus
        },
        publicationToRef: {
            ...link?.publicationToRef,
            currentStatus: link?.publicationToRef.versions[0].currentStatus,
            publicationStatus: link?.publicationToRef.versions[0].publicationStatus
        }
    };

    return simplifiedLink;
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
