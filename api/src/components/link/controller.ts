import * as response from 'lib/response';
import * as I from 'interface';
import * as linkService from 'link/service';
import * as publicationService from 'publication/service';

export const canLinkBeCreatedBetweenPublicationTypes = (
    fromType: I.PublicationType,
    toType: I.PublicationType
): boolean => {
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
    creator: I.User
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
            if (fromLatestVersion.user.id !== creator.id) {
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

            // Does a link already exist?
            const linkExists = await linkService.doesLinkExist(from.publicationId, toPublicationId);

            if (linkExists) {
                return { valid: false, details: { code: 400, message: 'Link already exists.' } };
            }

            // Publications cannot link to themselves.
            if (from.publicationId === toPublicationId) {
                return {
                    valid: false,
                    details: { code: 400, message: 'You cannot link a publication to itself.' }
                };
            }
        } else {
            fromType = from.type;
        }

        const toPublication = await publicationService.privateGet(toPublicationId);

        if (!toPublication) {
            return {
                valid: false,
                details: { code: 404, message: `Publication to link to with id ${toPublicationId} not found.` }
            };
        }

        // Check if publication to be linked to has a live version
        const toLatestLiveVersion = toPublication.versions.find((version) => version.isLatestLiveVersion);
        const toLatestVersion = toPublication.versions.find((version) => version.isLatestVersion);

        if (!toLatestVersion) {
            throw Error(`Publication to be linked to with ID ${toPublicationId} does not have a latest version.`);
        }

        let toVersionId: string;

        if (toLatestLiveVersion === undefined) {
            // This publication has not been made live.

            // Peer reviews cannot link to a draft.
            if (fromType === 'PEER_REVIEW') {
                return {
                    valid: false,
                    details: {
                        code: 400,
                        message: `Publication with id ${toPublicationId} is not LIVE, and peer reviews cannot link to drafts.`
                    }
                };
            }

            // If the user is a coauthor on the current version of the publication, they can link to it even if it's a draft.
            if (
                toLatestVersion.coAuthors.some(
                    (coAuthor) => coAuthor.linkedUser === creator.id || coAuthor.email === creator.email
                )
            ) {
                toVersionId = toLatestVersion.id;
            } else {
                return {
                    valid: false,
                    details: {
                        code: 400,
                        message: `Publication with id ${toPublicationId} is not LIVE, and you are not an author on the DRAFT, so a link cannot be created to it.`
                    }
                };
            }
        } else {
            toVersionId = toLatestLiveVersion.id;
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
                versionId: toVersionId
            }
        };
    } catch (err) {
        console.log(err);

        return {
            valid: false,
            details: { code: 500, message: 'Link validation failed because of an unexpected error.' }
        };
    }
};

export const create = async (event: I.AuthenticatedAPIRequest<I.CreateLinkBody>): Promise<I.JSONResponse> => {
    try {
        const validate = await createLinkValidation(
            { existing: true, publicationId: event.body.from },
            event.body.to,
            event.user
        );

        if (!validate.valid) {
            return response.json(validate.details.code, { message: validate.details.message });
        }

        const link = await linkService.create(
            event.body.from,
            validate.toPublication.publicationId,
            validate.toPublication.versionId
        );

        return response.json(200, link);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const deleteLink = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.DeleteLinkPathParams>
): Promise<I.JSONResponse> => {
    try {
        const link = await linkService.get(event.pathParameters.id);

        if (!link) {
            return response.json(404, { message: 'Link not found' });
        }

        if (!link.draft) {
            return response.json(403, { message: 'You are not allowed to delete inherited Links.' });
        }

        const fromCurrentVersion = link.publicationFrom.versions.find((version) => version.isLatestVersion);

        if (
            fromCurrentVersion?.currentStatus !== 'DRAFT' ||
            !fromCurrentVersion.publicationStatus.every((status) => status.status !== 'LIVE')
        ) {
            return response.json(404, {
                message: 'A link can only be deleted if it has been made from a publication currently in draft state.'
            });
        }

        if (fromCurrentVersion?.user.id !== event.user.id) {
            return response.json(403, { message: 'You do not have permissions to delete this link' });
        }

        await linkService.deleteLink(event.pathParameters.id);

        return response.json(200, { message: 'Link deleted' });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};
