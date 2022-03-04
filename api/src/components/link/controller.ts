import * as response from 'lib/response';
import * as linkService from 'link/service';
import * as publicationService from 'publication/service';

import * as I from 'interface';

export const create = async (event: I.AuthenticatedAPIRequest<I.CreateLinkBody>) => {
    try {
        // function checks if the user has permission to see it in DRAFT mode
        const fromPublication = await publicationService.get(event.body.from);

        // the publication does not exist, is
        // publications that are live cannot have links created.
        if (!fromPublication || fromPublication?.currentStatus === 'LIVE') {
            return response.json(404, {
                message: `Publication with id ${event.body.to} is either LIVE or does not eixst.`
            });
        }

        // the authenticated user is not the owner of the publication
        if (fromPublication.user.id !== event.user.id) {
            return response.json(404, { message: `You do not have permission to create publication links` });
        }

        // since we are not passing in a user, this should only return a publication if it is LIVE
        const toPublication = await publicationService.get(event.body.to);

        // toPublication does not exist in a LIVE state
        if (!toPublication || toPublication.currentStatus !== 'LIVE') {
            return response.json(404, {
                message: `Publication with id ${event.body.to} is either not LIVE or does not eixst.`
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
            return response.json(404, { message: `Link already exists.` });
        }

        const link = await linkService.create(event.body.from, event.body.to);

        return response.json(200, link);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const deleteLink = async (event: I.AuthenticatedAPIRequest<undefined, undefined, I.DeleteLinkPathParams>) => {
    try {
        const link = await linkService.get(event.pathParameters.id);

        if (!link) {
            return response.json(404, { message: 'Link not found' });
        }

        if (
            link.publicationFromRef.currentStatus !== 'DRAFT' ||
            !link.publicationFromRef.publicationStatus.every((status) => status.status === 'DRAFT')
        ) {
            return response.json(404, { message: 'Cannot delete a link where the publicationFrom is DRAFT ' });
        }

        if (link.publicationFromRef.user.id !== event.user.id) {
            return response.json(403, { message: 'You do not have permissions to delete this link' });
        }

        await linkService.deleteLink(event.pathParameters.id);

        return response.json(200, { message: 'Link deleted' });
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
