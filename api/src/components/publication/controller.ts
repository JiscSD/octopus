import * as response from 'lib/response';
import * as service from './service';
import * as I from 'interface';

export const getAll = async (event): Promise<I.JSONResponse> => {
    try {
        // params from query string/event
        console.log(event);
        const publications = await service.getAll();
        return response.json(200, publications);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};
