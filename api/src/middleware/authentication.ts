import middy from '@middy/core';
import jwt from 'jsonwebtoken';

import * as I from 'interface';
import * as response from 'lib/response';

const authentication = (): middy.MiddlewareObj => {
    const before: middy.MiddlewareFn<I.APIGatewayProxyEventV2> = async (request): Promise<I.JSONResponse | void> => {
        const { Authorization } = request.event.headers;

        const token = Authorization?.slice(7, Authorization.length);
        if (!token) {
            return response.json(401, { message: 'No token supplied.' });
        }

        try {
            const decodedJWT = jwt.verify(token, 'secret');

            // Assign the user object onto the lambda event.
            Object.assign(request.event, { user: decodedJWT });
        } catch (err) {
            return response.json(401, { message: 'Invalid token.' });
        }
    };
    return {
        before
    };
};

export default authentication;