import * as I from 'interface';
import * as pubRouterService from './service';
import * as publicationVersionService from 'publicationVersion/service';
import * as response from 'lib/response';

/**
 * Fires a notification to the PubRouter API with details of a new publication when it has a PDF generated.
 * This can only be triggered locally - on deployed environments the service function is programatically called upon publish.
 * @param event When a request is made to the API to trigger this function locally.
 * @returns A response object with a status code and message.
 */
export const notifyPubRouter = async (
    event: I.APIRequest<undefined, undefined, I.LocalNotifyPubRouterPathParams>
): Promise<I.JSONResponse> => {
    const publicationId = event.pathParameters.publicationId;

    try {
        const publicationVersion = await publicationVersionService.get(publicationId, 'latest');

        if (!publicationVersion) {
            return response.json(404, {
                message: 'Publication version not found.'
            });
        }

        // If publication was written by Science Octopus (seed data), don't send.
        if (publicationVersion.user && publicationVersion.user.id === 'octopus') {
            console.log('Publication author is Octopus user, ignoring');

            return response.json(200, { message: 'Publication author is Octopus user, ignoring' });
        }

        const { code, message } = await pubRouterService.notifyPubRouter(publicationVersion);

        return response.json(code, { message });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};
