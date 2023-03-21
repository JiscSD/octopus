import * as response from 'lib/response';
import * as publicationService from 'publication/service';
import * as affiliationService from './service';
import * as I from 'interface';

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreateAffiliationRequestBody, undefined, I.CreateAffiliationPathParams>
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
                message: 'You can only an affiliation to a draft publication.'
            });
        }

        if (event.user.id !== publication.user.id) {
            return response.json(403, {
                message: 'You do not have permissions to add an affiliation to this publication.'
            });
        }

        const affiliation = await affiliationService.create(event.pathParameters.id, event.body);

        return response.json(200, affiliation);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const destroy = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.DeleteAffiliationPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        //check that the publication exists
        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        if (publication.currentStatus !== 'DRAFT') {
            return response.json(403, {
                message: 'You cannot delete an affiliation from a publication that is not in a draft state.'
            });
        }

        if (event.user.id !== publication.user.id) {
            return response.json(403, {
                message: 'You do not have permissions to delete an affiliation for this publication.'
            });
        }

        const affiliation = await affiliationService.destroy(event.pathParameters.id, event.pathParameters.affiliation);

        return response.json(200, affiliation);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const destroyAll = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.DeleteAffiliationPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        //check that the publication exists
        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        if (publication.currentStatus !== 'DRAFT') {
            return response.json(403, {
                message: 'You cannot delete the affiliations from a publication that is not in a draft state.'
            });
        }

        if (event.user.id !== publication.user.id) {
            return response.json(403, {
                message: 'You do not have permissions to delete an affiliation for this publication.'
            });
        }

        await affiliationService.destroyAll(event.pathParameters.id);

        return response.json(200, { message: `Affliations removed for publication ${event.pathParameters.id}.` });
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};
