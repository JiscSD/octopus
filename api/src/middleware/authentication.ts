import middy from '@middy/core';

import * as I from 'interface';
import * as response from 'lib/response';
import * as userService from 'user/service';

const authentication = (): middy.MiddlewareObj => {
    const before: middy.MiddlewareFn<I.APIGatewayProxyEventV2> = async (request): Promise<I.JSONResponse | void> => {
        try {
            let user;
    
            const apiKey = request.event.queryStringParameters?.apiKey;
            console.log(apiKey)
            // const bearerToken = request.event.headers?.Authorization;
    
            if (apiKey) {
                user = await userService.getByApiKey(apiKey);
                console.log(user);
            }
    
            if (!user) {
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