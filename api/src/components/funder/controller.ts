import * as response from 'lib/response';
import * as funderService from 'funder/service';
import * as publicationVersionService from 'publicationVersion/service';
import * as I from 'interface';

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreateFunderRequestBody, undefined, I.CreateFunderPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publicationVersion = await publicationVersionService.getById(event.pathParameters.publicationVersionId);

        //check that the publication exists
        if (!publicationVersion) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        if (event.user.id !== publicationVersion.user.id) {
            return response.json(403, {
                message: 'You do not have permissions to add a funder.'
            });
        }

        //check that the publication is live
        if (publicationVersion.currentStatus !== 'DRAFT') {
            return response.json(400, {
                message: 'You can only add funding to a draft publication.'
            });
        }

        // Duplicate funder (designated by ROR ID or funder link) is allowed if both funders have grant IDs and they are different.
        const duplicateFunders = event.body.ror
            ? publicationVersion.funders.filter(
                  (funder) => funder.ror === event.body.ror || funder.link === event.body.link
              )
            : publicationVersion.funders.filter((funder) => funder.link === event.body.link);

        if (
            (!event.body.grantId && duplicateFunders.length) ||
            (event.body.grantId && duplicateFunders.some((funder) => !funder.grantId))
        ) {
            return response.json(400, { message: 'This funder already exists on this publication version.' });
        } else {
            if (duplicateFunders.some((funder) => funder.grantId === event.body.grantId)) {
                return response.json(400, {
                    message: 'This funder and grant identifier already exist on this publication version.'
                });
            }
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
        const publicationVersion = await publicationVersionService.getById(event.pathParameters.publicationVersionId);

        //check that the publication version exists
        if (!publicationVersion) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        //check that the publication is live
        if (publicationVersion.currentStatus !== 'DRAFT') {
            return response.json(400, {
                message: 'You cannot delete funding from a publication that is not a draft.'
            });
        }

        if (event.user.id !== publicationVersion.user.id) {
            return response.json(403, {
                message: 'You do not have permissions to delete a funder.'
            });
        }

        const funder = await funderService.destroy(publicationVersion.id, event.pathParameters.funderId);

        return response.json(200, funder);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};
