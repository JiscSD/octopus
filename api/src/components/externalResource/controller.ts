import * as response from 'lib/response';
import * as externalResourceService from 'externalResource/service';
import * as publicationVersionService from 'publicationVersion/service';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreateExternalResourceBody, undefined, I.CreateExternalResourcePathParams>
): Promise<I.JSONResponse> => {
    try {
        const publicationVersion = await publicationVersionService.getById(event.pathParameters.id);

        if (!publicationVersion) {
            return response.json(404, {
                message: 'This publication version does not exist'
            });
        }

        // Ensure that the publication version is DRAFT
        if (publicationVersion?.currentStatus !== 'DRAFT') {
            return response.json(403, {
                message: 'You can only add an external resource to a draft publication'
            });
        }

        // Ensure that current user owns this publication version
        if (event.user.id !== publicationVersion.user.id) {
            return response.json(403, {
                message: 'You cannot add an external resource to a publication version you do not own'
            });
        }

        // Ensure URL is valid
        if (!Helpers.validateURL(event.body.url)) {
            return response.json(403, {
                message: 'You must supply a valid URL'
            });
        }

        // Create the external resource
        const externalResource = await externalResourceService.create(event.pathParameters.id, event.body);

        return response.json(200, externalResource);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error' });
    }
};
