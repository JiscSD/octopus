import * as I from 'interface';
import * as response from 'lib/response';
import * as referenceService from 'reference/service';
import * as publicationVersionService from 'publicationVersion/service';

export const get = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.CreateReferencePath>
): Promise<I.JSONResponse> => {
    try {
        const references = await referenceService.getAllByPublicationVersion(event.pathParameters.id);

        return response.json(200, references);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const updateAll = async (
    event: I.AuthenticatedAPIRequest<I.UpdateReferencesBody, undefined, I.CreateReferencePath>
): Promise<I.JSONResponse> => {
    try {
        const version = await publicationVersionService.get(event.pathParameters.id);

        //check that the version exists
        if (!version) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        // References should only be updated on the current version
        if (!version.isCurrent) {
            return response.json(403, {
                message: 'References can only be updated on the current version.'
            });
        }

        // Skip this check if the user is octopus, to allow for seed data
        // to update live publications
        if (event.user.id !== 'octopus') {
            //check that the publication is live
            if (version.currentStatus !== 'DRAFT') {
                return response.json(403, {
                    message: 'You can only add references to a draft publication.'
                });
            }
        }

        // Check that the request body and pathParams have a matching publicationVersion ID
        if (event.body.some((reference) => reference.publicationVersionId !== version.id)) {
            return response.json(403, {
                message: 'Please ensure the publication version ID is the same in the request body and path.'
            });
        }

        const reference = await referenceService.updateAll(version.id, event.body);

        return response.json(200, reference);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};
