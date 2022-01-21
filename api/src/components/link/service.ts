import prisma from 'lib/client';

export const create = async (fromPublicationId: string, toPublicationId: string) => {
    const link = await prisma.links.create({
        data: {
            publicationFrom: fromPublicationId,
            publicationTo: toPublicationId
        }
    });

    return link;
};

export const doesLinkExist = async (fromPublicationId: string, toPublicationId: string) => {
    const link = await prisma.links.findFirst({
        where: {
            publicationFrom: fromPublicationId,
            publicationTo: toPublicationId
        }
    });

    return link;
}

export const canLinkBeCreatedBetweenPublicationTypes = (fromType, toType) => {
    const publicationTypes = ['PROBLEM', 'HYPOTHESIS', 'PROTOCOL', 'DATA', 'ANALYSIS', 'INTERPRETATION', 'REAL_WORLD_APPLICATION'];

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