import middy from '@middy/core';

import * as I from 'interface';
import * as response from 'lib/response';
import * as userService from 'user/service';
import * as authorizationService from 'authorization/service';

const authentication = (optional = false, requiresName = true): middy.MiddlewareObj => {
    const before: middy.MiddlewareFn<I.APIGatewayProxyEventV2> = async (request): Promise<I.JSONResponse | void> => {
        try {
            let user: null | I.User = null;

            const apiKey = request.event.queryStringParameters?.apiKey;
            const bearerToken = request.event.headers.Authorization;

            if (apiKey) {
                user = await userService.getByApiKey(apiKey);
            } else if (bearerToken) {
                user = authorizationService.validateJWT(bearerToken.split(' ')[1]);
            }

            if (!optional) {
                // If there's no user account, and authentication is *not* optional, then the request is blocked.
                if (!user) {
                    return response.json(401, { message: 'Please enter either a valid apiKey or bearer token.' });
                }

                // If the user hasn't made their name visible in ORCiD, we want to disallow them from doing most actions.
                if (!user?.firstName && !user?.lastName && requiresName) {
                    return response.json(403, {
                        message:
                            'No name detected. Please ensure your name visibility is set to "Everyone" or "Trusted parties" on your ORCiD account, then re-authorize at /authorization.'
                    });
                }
            }

            Object.assign(request.event, { user });
        } catch (err) {
            console.log(err);

            return response.json(401, { message: 'Unknown authentication error, please contact help@jisc.ac.uk.' });
        }
    };

    return {
        before
    };
};

export default authentication;
