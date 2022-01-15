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

export const create = async (event: I.AuthenticatedAPIRequest<I.CreatePublicationRequestBody>): Promise<I.JSONResponse> => {
    try {
        const publication = await publicationService.create(event.body, { id: 'ckyg89bfh00111m6i34s2qk0w' });

        return response.json(200, publication);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }

}