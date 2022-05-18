import * as response from 'lib/response';
import * as funderService from 'funder/service';
import * as publicationService from 'publication/service';
import * as I from 'interface';

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreateFunderRequestBody, undefined, I.CreateFunderPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        //check that the publication exists
        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        //check that the publication is live
        if (publication.currentStatus !== 'DRAFT') {
            return response.json(403, {
                message: 'You can only add funding to a draft publication.'
            });
        }

        if (event.user.id !== publication.user.id) {
            return response.json(403, {
                message: 'You do not have permissions to add a funder.'
            });
        }

        const funder = await funderService.create(event.pathParameters.id, event.body);

        return response.json(200, funder);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const destroy = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.DeleteFunderPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        //check that the publication exists
        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        //check that the publication is live
        if (publication.currentStatus !== 'DRAFT') {
            return response.json(403, {
                message: 'You cannot delete funding from a publication that is not a draft.'
            });
        }

        if (event.user.id !== publication.user.id) {
            return response.json(403, {
                message: 'You do not have permissions to delete a funder.'
            });
        }

        const funder = await funderService.destroy(event.pathParameters.id, event.pathParameters.funder);

        return response.json(200, funder);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
