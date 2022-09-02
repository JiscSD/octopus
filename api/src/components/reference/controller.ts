import * as I from 'interface';
import * as response from 'lib/response';
import * as referenceService from 'reference/service';

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
        const reference = await referenceService.create({ publicationId: event.pathParameters.id, ...event.body });

        return response.json(200, reference);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const update = async (event: I.AuthenticatedAPIRequest<I.Reference, undefined, I.UpdateReferencePath>) => {
    try {
        const reference = await referenceService.update(event.pathParameters.referenceId, event.body);

        return response.json(200, reference);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const updateAll = async (event: I.AuthenticatedAPIRequest<I.Reference[], undefined, I.CreateReferencePath>) => {
    console.log(event.body);
    try {
        const reference = await referenceService.updateAll(event.pathParameters.id, event.body);

        return response.json(200, reference);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const remove = async (event: I.AuthenticatedAPIRequest<undefined, undefined, I.UpdateReferencePath>) => {
    try {
        const reference = await referenceService.remove(event.pathParameters.referenceId);

        return response.json(200, reference);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const removeAll = async (event: I.AuthenticatedAPIRequest<undefined, undefined, I.RemoveAllReferencesPath>) => {
    try {
        const reference = await referenceService.removeAll(event.pathParameters.publicationId);

        return response.json(200, reference);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};
