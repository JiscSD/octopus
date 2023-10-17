import middy from '@middy/core';

import * as I from 'interface';
import * as response from 'lib/response';
import * as publicationVersionService from 'publicationVersion/service';

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

            const publicationVersionId = request.event.pathParameters?.id;

            if (publicationVersionId) {
                const publicationVersion = await publicationVersionService.getById(publicationVersionId);

                if (!publicationVersion) {
                    return response.json(404, 'Publication version not found.');
                }

                if (publicationVersion.createdBy !== user.id) {
                    return response.json(403, {
                        message: 'User is not the author of this publication version.'
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
