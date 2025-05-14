import * as I from 'interface';
import * as publicationBundleService from 'publicationBundle/service';
import * as publicationService from 'publication/service';
import * as response from 'lib/response';

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreatePublicationBundleRequestBody, undefined, undefined>
): Promise<I.JSONResponse> => {
    // Check that publication IDs are unique.
    const hasDuplicates = new Set(event.body.publicationIds).size !== event.body.publicationIds.length;

    if (hasDuplicates) {
        return response.json(400, {
            message: 'Publication IDs must be unique.'
        });
    }

    // Check that publication IDs refer to a live publication.
    const notFoundIds: string[] = [];
    await Promise.all(
        event.body.publicationIds.map(async (id) => {
            const existsLive = await publicationService.isLive(id);

            if (!existsLive) {
                notFoundIds.push(id);
            }
        })
    );

    if (notFoundIds.length) {
        return response.json(400, {
            message: `No live publications exist with the following IDs: ${notFoundIds.join(', ')}`
        });
    }

    const bundle = await publicationBundleService.create({ ...event.body, userId: event.user.id });

    return response.json(201, bundle);
};
