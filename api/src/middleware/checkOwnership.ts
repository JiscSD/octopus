import middy from '@middy/core';

import * as I from 'interface';
import * as response from 'lib/response';
import * as publicationService from 'publication/service';

const checkOwnership = (): middy.MiddlewareObj => {
    const before: middy.MiddlewareFn<I.APIGatewayProxyEventV2 & Record<string, I.User>> = async (
        request
    ): Promise<I.JSONResponse | void> => {
        try {
            const user = request.event.user;

            // if there's no user account, and authentication is *not* optional, then the request is blocked.
            if (!user) {
                return response.json(401, { message: 'Please enter either a valid apiKey or bearer token.' });
            }

            const publicationId = request.event.pathParameters?.id;

            if (publicationId) {
                const publication = await publicationService.get(publicationId);

                if (publication && publication.createdBy !== user.id) {
                    return response.json(403, {
                        message: 'User is not the author of this publication.'
                    });
                }
            }
        } catch (err) {
            console.log(err);

            return response.json(401, { message: 'Unknown authentication error, please contact help@jisc.ac.uk.' });
        }
    };

    return {
        before
    };
};

export default checkOwnership;
