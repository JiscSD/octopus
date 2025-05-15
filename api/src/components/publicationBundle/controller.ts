import * as I from 'interface';
import * as publicationBundleService from 'publicationBundle/service';
import * as publicationService from 'publication/service';
import * as response from 'lib/response';

const validatePublicationIds = async (publicationIds: string[]): Promise<{ valid: boolean; message: string }> => {
    // Check that publication IDs are unique.
    const hasDuplicates = new Set(publicationIds).size !== publicationIds.length;

    if (hasDuplicates) {
        return {
            valid: false,
            message: 'Publication IDs must be unique.'
        };
    }

    // Check that publication IDs refer to a live publication.
    const notFoundIds: string[] = [];
    await Promise.all(
        publicationIds.map(async (id) => {
            const existsLive = await publicationService.isLive(id);

            if (!existsLive) {
                notFoundIds.push(id);
            }
        })
    );

    if (notFoundIds.length) {
        return {
            valid: false,
            message: `No live publications exist with the following IDs: ${notFoundIds.join(', ')}`
        };
    }

    return {
        valid: true,
        message: 'Publication IDs are valid.'
    };
};

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreatePublicationBundleRequestBody, undefined, undefined>
): Promise<I.JSONResponse> => {
    const validationCheck = await validatePublicationIds(event.body.publicationIds);

    if (!validationCheck.valid) {
        return response.json(400, { message: validationCheck.message });
    }

    const bundle = await publicationBundleService.create({ ...event.body, userId: event.user.id });

    return response.json(201, bundle);
};

export const edit = async (
    event: I.AuthenticatedAPIRequest<
        I.EditPublicationBundleRequestBody,
        undefined,
        I.SinglePublicationBundleOperationPathParams
    >
): Promise<I.JSONResponse> => {
    if (event.body.publicationIds?.length) {
        const validationCheck = await validatePublicationIds(event.body.publicationIds);

        if (!validationCheck.valid) {
            return response.json(400, { message: validationCheck.message });
        }
    }

    // Check if the publication bundle exists
    const bundle = await publicationBundleService.get(event.pathParameters.publicationBundleId);

    if (!bundle) {
        return response.json(404, { message: 'Publication bundle not found.' });
    }

    if (bundle.createdBy !== event.user.id) {
        return response.json(403, { message: 'You do not have permission to edit this publication bundle.' });
    }

    const editBundle = await publicationBundleService.edit(event.pathParameters.publicationBundleId, event.body);

    return response.json(200, editBundle);
};

export const deletePublicationBundle = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.SinglePublicationBundleOperationPathParams>
): Promise<I.JSONResponse> => {
    const bundle = await publicationBundleService.get(event.pathParameters.publicationBundleId);

    if (!bundle) {
        return response.json(404, { message: 'Publication bundle not found.' });
    }

    if (bundle.createdBy !== event.user.id) {
        return response.json(403, { message: 'You do not have permission to delete this publication bundle.' });
    }

    await publicationBundleService.deletePublicationBundle(event.pathParameters.publicationBundleId);

    return response.json(200, { message: 'Publication bundle deleted.' });
};

export const get = async (
    event: I.APIRequest<undefined, undefined, I.SinglePublicationBundleOperationPathParams>
): Promise<I.JSONResponse> => {
    const bundle = await publicationBundleService.get(event.pathParameters.publicationBundleId);

    if (!bundle) {
        return response.json(404, { message: 'Publication bundle not found.' });
    }

    return response.json(200, bundle);
};
