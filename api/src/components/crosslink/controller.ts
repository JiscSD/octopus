import * as crosslinkService from 'crosslink/service';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as publicationService from 'publication/service';
import * as response from 'lib/response';

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreateCrosslinkRequestBody, undefined, undefined>
): Promise<I.JSONResponse> => {
    try {
        const publicationA = await publicationService.get(event.body.publications[0]);
        const publicationB = await publicationService.get(event.body.publications[1]);

        if (!(publicationA && publicationB)) {
            return response.json(404, { message: 'One or both of the publications was not found.' });
        }

        if (publicationA.type !== publicationB.type) {
            return response.json(400, { message: 'Crosslinks must be between publications of the same type.' });
        }

        if (
            !(
                publicationA.versions.some((version) => version.currentStatus === 'LIVE') &&
                publicationB.versions.some((version) => version.currentStatus === 'LIVE')
            )
        ) {
            return response.json(400, { message: 'Both publications in a crosslink must be published.' });
        }

        const existingCrosslink = await crosslinkService.getByPublicationPair(event.body.publications);

        if (existingCrosslink) {
            return response.json(400, { message: 'This link cannot be added as it has already been suggested.' });
        }

        const crosslink = await crosslinkService.create(event.body.publications, event.user.id);

        // Automatically add an up vote from the crosslink's creator.
        await crosslinkService.setVote(crosslink.id, event.user.id, true);

        return response.json(200, crosslink);
    } catch {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const deleteCrosslink = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.DeleteCrosslinkPathParams>
): Promise<I.JSONResponse> => {
    try {
        const crosslink = await crosslinkService.getById(event.pathParameters.id);

        if (!crosslink) {
            return response.json(404, { message: 'Crosslink not found.' });
        }

        if (event.user.id !== crosslink.createdBy) {
            return response.json(403, { message: 'You do not have permission to delete this crosslink.' });
        }

        const deleteCrosslink = await crosslinkService.deleteCrosslink(event.pathParameters.id);

        return response.json(200, deleteCrosslink);
    } catch {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const setVote = async (
    event: I.AuthenticatedAPIRequest<I.SetCrosslinkVoteRequestBody, undefined, I.SetCrosslinkVotePathParams>
): Promise<I.JSONResponse> => {
    try {
        const crosslinkExists = await crosslinkService.exists(event.pathParameters.id);

        if (!crosslinkExists) {
            return response.json(404, { message: 'Crosslink not found.' });
        }

        const vote = await crosslinkService.setVote(event.pathParameters.id, event.user.id, event.body.vote);

        return response.json(200, vote);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const resetVote = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.ResetCrosslinkVotePathParams>
): Promise<I.JSONResponse> => {
    try {
        const crosslinkExists = await crosslinkService.exists(event.pathParameters.id);

        if (!crosslinkExists) {
            return response.json(404, { message: 'Crosslink not found.' });
        }

        const vote = await crosslinkService.getVote(event.pathParameters.id, event.user.id);

        if (!vote) {
            return response.json(404, { message: 'You have not voted on this crosslink.' });
        }

        const reset = await crosslinkService.resetVote(event.pathParameters.id, event.user.id);

        return response.json(200, reset);
    } catch {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getVote = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.GetCrosslinkVotePathParams>
): Promise<I.JSONResponse> => {
    try {
        const crosslinkExists = await crosslinkService.exists(event.pathParameters.id);

        if (!crosslinkExists) {
            return response.json(404, { message: 'Crosslink not found.' });
        }

        const vote = await crosslinkService.getVote(event.pathParameters.id, event.user.id);

        if (!vote) {
            return response.json(404, { message: 'You have not voted on this crosslink.' });
        }

        return response.json(200, vote);
    } catch {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const get = async (
    event: I.APIRequest<undefined, undefined, I.GetCrosslinkPathParams>
): Promise<I.JSONResponse> => {
    // Check if we are getting crosslink by its own ID or a pair of publication IDs
    const idSplit = event.pathParameters.id.split(',');
    const getByPublicationPair = idSplit.length === 2;

    try {
        const crosslink = getByPublicationPair
            ? await crosslinkService.getByPublicationPair([idSplit[0], idSplit[1]])
            : await crosslinkService.getById(event.pathParameters.id);

        if (!crosslink) {
            return response.json(404, { message: 'Crosslink not found.' });
        }

        return response.json(200, crosslink);
    } catch {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getPublicationCrosslinks = async (
    event: I.OptionalAuthenticatedAPIRequest<
        undefined,
        I.GetPublicationCrosslinksQueryParams,
        I.GetPublicationCrosslinksPathParams
    >
): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.publicationId);

        if (!publication) {
            return response.json(404, { message: 'Publication not found.' });
        }

        const ownLinks = event.queryStringParameters.own === 'true';

        if (ownLinks && !event.user) {
            return response.json(400, {
                message: 'Cannot filter to your own items when the request is not authenticated.'
            });
        }

        if (
            event.queryStringParameters.order === 'mix' &&
            (event.queryStringParameters.limit || event.queryStringParameters.offset)
        ) {
            return response.json(400, {
                message: 'Pagination cannot be used with "mix" sort order.'
            });
        }

        const search = event.queryStringParameters.search
            ? Helpers.sanitizeSearchQuery(event.queryStringParameters.search)
            : '';
        const limit = event.queryStringParameters?.limit || 10;
        const offset = event.queryStringParameters?.offset || 0;
        const userIdFilter = ownLinks && event.user?.id ? event.user.id : undefined;

        const crosslinks = await crosslinkService.getPublicationCrosslinks(event.pathParameters.publicationId, {
            order: event.queryStringParameters.order,
            search,
            limit,
            offset,
            userIdFilter
        });

        return response.json(200, crosslinks);
    } catch {
        return response.json(500, { message: 'Unknown server error.' });
    }
};
