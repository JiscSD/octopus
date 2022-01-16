import middy from '@middy/core';
import jwt from 'jsonwebtoken';

import * as I from 'interface';
import * as response from 'lib/response';

const authentication = (): middy.MiddlewareObj => {
    const before: middy.MiddlewareFn<I.APIGatewayProxyEventV2> = async (request): Promise<I.JSONResponse | void> => {
        const { Authorization } = request.event.headers;

        const authType = Authorization?.split(' ');
        let user;

        if (authType[0] === 'Bearer') {

        } else if (authType[0] === 'Basic') {

        } else {
            return response.json(401, { message: 'Send either a bearer token or API key to authenticate' });
        }

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