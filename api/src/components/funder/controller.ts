import * as response from 'lib/response';
import * as funderService from 'funder/service';
import * as publicationVersionService from 'publicationVersion/service';
import * as I from 'interface';

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreateFunderRequestBody, undefined, I.CreateFunderPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publicationVersion = await publicationVersionService.getById(event.pathParameters.id);

        //check that the publication exists
        if (!publicationVersion) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        //check that the publication is live
        if (publicationVersion.currentStatus !== 'DRAFT') {
            return response.json(403, {
                message: 'You can only add funding to a draft publication.'
            });
        }

        if (event.user.id !== publicationVersion.user.id) {
            return response.json(403, {
                message: 'You do not have permissions to add a funder.'
            });
        }

        if (
            publicationVersion.funders.some(
                (funder) => funder.ror === event.body.ror || funder.link === event.body.link
            )
        ) {
            return response.json(400, { message: 'This funder already exists on this publication version.' });
        }

        const funder = await funderService.create(publicationVersion.id, event.body);

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
        const publicationVersion = await publicationVersionService.getById(event.pathParameters.id);

        //check that the publication version exists
        if (!publicationVersion) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        //check that the publication is live
        if (publicationVersion.currentStatus !== 'DRAFT') {
            return response.json(403, {
                message: 'You cannot delete funding from a publication that is not a draft.'
            });
        }

        if (event.user.id !== publicationVersion.user.id) {
            return response.json(403, {
                message: 'You do not have permissions to delete a funder.'
            });
        }

        const funder = await funderService.destroy(publicationVersion.id, event.pathParameters.funder);

        return response.json(200, funder);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};
