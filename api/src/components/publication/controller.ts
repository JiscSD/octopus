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
        const publication = await publicationService.get(event.pathParameters.id);

        // anyone can see a LIVE publication
        if (publication?.currentStatus === 'LIVE') {
            return response.json(200, publication);
        }

        // only certain users can see a DRAFT publication
        if(event.user?.id === publication?.user.id) {
            return response.json(200, publication);
        }

        return response.json(404, { message: 'Publication is either not found, or you do not have permissions to view it in its current state.' });
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