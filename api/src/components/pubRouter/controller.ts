import { S3CreateEvent } from 'aws-lambda';

import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as pubRouterService from './service';
import * as publicationVersionService from 'publicationVersion/service';
import * as response from 'lib/response';
import * as s3 from 'lib/s3';

/**
 * Fires a notification to the PubRouter API with details of a new publication when it has a PDF generated.
 * @param event When a file is deposited into the PDF S3 bucket (on deployed environments), or when
 *              a request is made to the API to trigger this function (locally).
 * @returns A response object with a status code and message.
 */
export const notifyPubRouter = async (
    event: S3CreateEvent | I.APIRequest<undefined, undefined, I.LocalNotifyPubRouterPathParams>
): Promise<I.JSONResponse> => {
    let publicationId: string;
    let pdfUrl: string;

    // If this is running locally, get details from lambda event.
    if (process.env.STAGE === 'local' && Object.hasOwn(event, 'pathParameters')) {
        const lambdaEvent = event as I.APIRequest<undefined, undefined, I.LocalNotifyPubRouterPathParams>;
        publicationId = lambdaEvent.pathParameters.publicationId;
        pdfUrl = Helpers.checkEnvVariable('LOCALSTACK_SERVER') + s3.buckets.pdfs + `/${publicationId}.pdf`;
    } else {
        // Otherwise, the "real" way, get details from S3 event.
        const s3Event = event as S3CreateEvent;
        const bucket = s3Event.Records[0].s3.bucket.name;
        const key = s3Event.Records[0].s3.object.key;
        pdfUrl = `https://${bucket}.s3.amazonaws.com/${key}`;
        publicationId = key.replace(/\.pdf$/, '');
    }

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

        const { code, message } = await pubRouterService.notifyPubRouter(publicationVersion, pdfUrl);

        return response.json(code, { message });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};
