import middy from '@middy/core';

import * as I from 'interface';
import * as response from 'lib/response';
import * as userService from 'user/service';

const authentication = (optional = false): middy.MiddlewareObj => {
    const before: middy.MiddlewareFn<I.APIGatewayProxyEventV2> = async (request): Promise<I.JSONResponse | void> => {
        try {
            let user: null | I.User = null;
    
            const apiKey = request.event.queryStringParameters?.apiKey;
    
            if (apiKey) {
                user = await userService.getByApiKey(apiKey);
            }
    
            // if there's no user account, and authentication is *not* optional, then the request is blocked.
            if (!user && !optional) {
                return response.json(401, { message: 'Please enter either a valid apiKey or bearer token.' });
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