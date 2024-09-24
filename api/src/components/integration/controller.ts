import * as I from 'interface';
import * as integrationService from 'integration/service';
import * as response from 'lib/response';

export const incrementalAriIngest = async (
    event: I.APIRequest | I.EventBridgeEvent<'Scheduled Event', string>
): Promise<I.JSONResponse> => {
    // This can also be triggered on a schedule, in which case we don't need to check for an API key,
    // so only check for the API key if the event is an API request.
    if (event && 'headers' in event) {
        const apiKey = event.queryStringParameters?.apiKey;

        if (apiKey !== process.env.TRIGGER_ARI_INGEST_API_KEY) {
            return response.json(401, { message: "Please provide a valid 'apiKey'." });
        }
    }

    try {
        const ingestResult = await integrationService.incrementalAriIngest();

        return response.json(200, ingestResult);
    } catch (error) {
        console.log(error);

        return response.json(500, { message: 'Unknown server error.' });
    }
};
