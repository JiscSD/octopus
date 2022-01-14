import * as response from 'lib/response';
import * as config from 'config';
import * as I from 'interface';

export const healthcheck = async (event): Promise<I.JSONResponse> => {
    try {
        return response.json(200, { message: config.application, event: event });
    } catch (err) {
        return response.json(200, { message: err });
    }
};
