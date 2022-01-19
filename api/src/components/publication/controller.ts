import * as response from 'lib/response';
import * as publicationService from 'publication/service';
import * as I from 'interface';

export const getAll = async (event: I.APIRequest): Promise<I.JSONResponse> => {
    try {
        const publications = await publicationService.getAll();

        return response.json(200, publications);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const get = async (event: I.AuthenticatedAPIRequest<undefined, undefined, I.GetPublicationPathParams>): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.get(event.pathParameters.id, event.user);

        return response.json(200, publication);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const create = async (event: I.AuthenticatedAPIRequest<I.CreatePublicationRequestBody>): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.create(event.body, event.user);

        return response.json(200, publication);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};