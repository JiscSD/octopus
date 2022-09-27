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

export const create = async (event: I.AuthenticatedAPIRequest<I.Reference, undefined, I.CreateReferencePath>) => {
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
                message: 'You can only add references to a draft publication.'
            });
        }

        if (event.body.publicationId !== event.pathParameters.id || event.body.id == '' || event.body.text == '') {
            return response.json(422, {
                message: 'Please fill out all of the required fields.'
            });
        }

        const reference = await referenceService.create({ ...event.body });

        return response.json(200, reference);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const update = async (event: I.AuthenticatedAPIRequest<I.Reference, undefined, I.UpdateReferencePath>) => {
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
                message: 'You can only add references to a draft publication.'
            });
        }

        if (event.body.publicationId !== event.pathParameters.id) {
            return response.json(403, {
                message: 'Please enter the correct publication id.'
            });
        }

        const reference = await referenceService.update(event.pathParameters.referenceId, event.body);

        return response.json(200, reference);
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

        //check that the publication is live
        if (publication.currentStatus !== 'DRAFT') {
            return response.json(403, {
                message: 'You can only add references to a draft publication.'
            });
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

export const remove = async (event: I.AuthenticatedAPIRequest<undefined, undefined, I.UpdateReferencePath>) => {
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
                message: 'You can only remove references from a draft publication.'
            });
        }

        const reference = await referenceService.remove(event.pathParameters.referenceId);

        return response.json(200, reference);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const removeAll = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.RemoveAllReferencesPathParams>
) => {
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
                message: 'You can only remove references from a draft publication.'
            });
        }
        const reference = await referenceService.removeAll(event.pathParameters.id);

        return response.json(200, reference);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};
