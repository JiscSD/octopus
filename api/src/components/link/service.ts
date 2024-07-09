import * as client from 'lib/client';
import * as I from 'interface';
import * as publicationService from 'publication/service';
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

/**
 * Validates whether a link can be created between two publications.
 * The "from" publication can be existing or new.
 * If invalid, returns suggested response code and message.
 * If valid, for convenience, additionally returns target version ID, ready to use in creation.
 * */
export const createLinkValidation = async (
    from: { existing: true; publicationId: string } | { existing: false; type: I.PublicationType },
    toPublicationId: string,
    creatorUserId: string
): Promise<
    | { valid: false; details: { code: number; message: string } }
    | {
          valid: true;
          toPublication: { publicationId: string; versionId: string };
      }
> => {
    let fromType: I.PublicationType;

    try {
        if (from.existing) {
            const fromPublication = await publicationService.get(from.publicationId);

            if (!fromPublication) {
                return {
                    valid: false,
                    details: { code: 404, message: `Publication to link from with id ${from.publicationId} not found.` }
                };
            }

            fromType = fromPublication.type;

            const fromLatestVersion = fromPublication.versions.find((version) => version.isLatestVersion);

            if (!fromLatestVersion) {
                return {
                    valid: false,
                    details: {
                        code: 404,
                        message: `Cannot find latest version of ${from.publicationId} in order to create a link from it.`
                    }
                };
            }

            if (fromLatestVersion.currentStatus === 'LIVE') {
                return {
                    valid: false,
                    details: {
                        code: 400,
                        message: `Publication with id ${from.publicationId} is LIVE, so a link cannot be created from it.`
                    }
                };
            }

            // The link creator is not the owner of the publication
            if (fromLatestVersion.user.id !== creatorUserId) {
                return {
                    valid: false,
                    details: {
                        code: 403,
                        message: `You cannot create a link from the publication with id ${from.publicationId}.`
                    }
                };
            }

            // Peer reviews can only be linked to one thing
            if (fromPublication.type === 'PEER_REVIEW' && fromPublication.linkedTo.length !== 0) {
                return {
                    valid: false,
                    details: {
                        code: 403,
                        message: 'You cannot create another link from a peer review that already has one.'
                    }
                };
            }

            // does a link already exist?
            const linkExists = await doesLinkExist(from.publicationId, toPublicationId);

            if (linkExists) {
                return { valid: false, details: { code: 400, message: 'Link already exists.' } };
            }
        } else {
            fromType = from.type;
        }

        const toPublication = await publicationService.get(toPublicationId);

        if (!toPublication) {
            return {
                valid: false,
                details: { code: 404, message: `Publication to link to with id ${toPublicationId} not found.` }
            };
        }

        // Check if publication to be linked to has a live version
        const toLatestLiveVersion = toPublication.versions.find((version) => version.isLatestLiveVersion);

        if (!toLatestLiveVersion) {
            return {
                valid: false,
                details: {
                    code: 400,
                    message: `Publication with id ${toPublicationId} is not LIVE, so a link cannot be created to it.`
                }
            };
        }

        const validPublicationTypes = canLinkBeCreatedBetweenPublicationTypes(fromType, toPublication.type);

        if (!validPublicationTypes) {
            return {
                valid: false,
                details: {
                    code: 400,
                    message: `A link cannot be created from a publication of type ${fromType} to a publication of type ${toPublication.type}.`
                }
            };
        }

        return {
            valid: true,
            toPublication: {
                publicationId: toPublication.id,
                versionId: toLatestLiveVersion.id
            }
        };
    } catch (err) {
        console.log(err);

        return { valid: false, details: { code: 500, message: 'Unknown server error.' } };
    }
};
