import * as response from 'lib/response';
import * as linkService from 'link/service';

import * as I from 'interface';

export const create = async (event: I.AuthenticatedAPIRequest<I.CreateLinkBody>): Promise<I.JSONResponse> => {
    try {
        const validate = await linkService.createLinkValidation(
            { existing: true, publicationId: event.body.from },
            event.body.to,
            event.user.id
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
