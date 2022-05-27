import * as I from 'interface';
import * as response from 'lib/response';
import * as referenceService from 'reference/service';

export const create = async (event: I.AuthenticatedAPIRequest<I.Reference, undefined, undefined>) => {
    try {
        // TODO: Check ownership
        const reference = await referenceService.create(event.body.publicationId, event.body.type, event.body.text);

        return response.json(200, reference);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const update = async (event: I.AuthenticatedAPIRequest<I.Reference, undefined, I.ReferencePath>) => {
    try {
        // TODO: Check ownership

        const reference = await referenceService.update(
            event.pathParameters.referenceId,
            event.body.type,
            event.body.text
        );

        return response.json(200, reference);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const remove = async (event: I.AuthenticatedAPIRequest<undefined, undefined, I.ReferencePath>) => {
    try {
        // TODO: Check ownership

        const reference = await referenceService.remove(event.pathParameters.referenceId);

        return response.json(200, reference);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
