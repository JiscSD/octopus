import * as I from 'interface';
import * as response from 'lib/response';
import * as referenceService from 'reference/service';
import * as publicationService from 'publication/service';

export const get = async (event: I.AuthenticatedAPIRequest<undefined, undefined, I.CreateReferencePath>) => {
    try {
        const references = await referenceService.getAllByPublication(event.pathParameters.id);

        return response.json(200, references);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const updateAll = async (event: I.AuthenticatedAPIRequest<I.Reference[], undefined, I.CreateReferencePath>) => {
    try {
        const publication = await publicationService.get(event.pathParameters.id);

        //check that the publication exists
        if (!publication) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        // Skip this check if the user is octopus, to allow for seed data
        // to update live publications
        if (event.user.id !== 'octopus') {
            //check that the publication is live
            if (publication.currentStatus !== 'DRAFT') {
                return response.json(403, {
                    message: 'You can only add references to a draft publication.'
                });
            }
        }

        // check that we are updating the publication with the correct id
        if (event.body.some((reference) => reference.publicationId !== event.pathParameters.id)) {
            return response.json(403, {
                message: 'Please enter the correct publication id.'
            });
        }

        const reference = await referenceService.updateAll(event.pathParameters.id, event.body);

        return response.json(200, reference);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
