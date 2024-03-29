import * as response from 'lib/response';
import * as linkService from 'link/service';
import * as publicationService from 'publication/service';

import * as I from 'interface';

export const create = async (event: I.AuthenticatedAPIRequest<I.CreateLinkBody>): Promise<I.JSONResponse> => {
    try {
        const fromPublication = await publicationService.get(event.body.from);

        if (!fromPublication) {
            return response.json(404, {
                message: `Publication with id ${event.body.from} not found.`
            });
        }

        const fromLatestVersion = fromPublication.versions.find((version) => version.isLatestVersion);

        if (!fromLatestVersion) {
            return response.json(403, {
                message: `Cannot find latest version of ${event.body.from}.`
            });
        }

        if (fromLatestVersion.currentStatus === 'LIVE') {
            return response.json(403, {
                message: `Publication with id ${event.body.from} is LIVE.`
            });
        }

        // The authenticated user is not the owner of the publication
        if (fromLatestVersion.user.id !== event.user.id) {
            return response.json(401, { message: 'You do not have permission to create publication links' });
        }

        // Peer reviews can only be linked to one thing
        if (fromPublication.type === 'PEER_REVIEW' && fromPublication.linkedTo.length !== 0) {
            return response.json(403, { message: 'Peer reviews can only have 1 link.' });
        }

        const toPublication = await publicationService.get(event.body.to);

        if (!toPublication) {
            return response.json(404, {
                message: `Publication with id ${event.body.to} does not exist.`
            });
        }

        // Check if publication to be linked to has a live version
        const toLatestLiveVersion = toPublication.versions.find((version) => version.isLatestLiveVersion);

        if (!toLatestLiveVersion) {
            return response.json(403, {
                message: `Publication with id ${event.body.to} is not LIVE.`
            });
        }

        const isLinkValid = linkService.canLinkBeCreatedBetweenPublicationTypes(
            fromPublication.type,
            toPublication.type
        );

        if (!isLinkValid) {
            return response.json(404, {
                message: `Link cannot be created between types from "${fromPublication.type}" to ${toPublication.type}.`
            });
        }

        // does a link already exist?
        const doesLinkExist = await linkService.doesLinkExist(event.body.from, event.body.to);

        if (doesLinkExist) {
            return response.json(404, { message: 'Link already exists.' });
        }

        const link = await linkService.create(event.body.from, event.body.to, toLatestLiveVersion.id);

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
