import * as I from 'interface';
import * as ingestLogService from 'ingestLog/service';
import * as integrationService from 'integration/service';
import * as response from 'lib/response';

export const incrementalAriIngest = async (
    event: I.APIRequest | I.EventBridgeEvent<'Scheduled Event', string>
): Promise<I.JSONResponse> => {
    const triggeredByHttp = event && 'headers' in event;

    // This can also be triggered on a schedule, in which case we don't need to check for an API key,
    // so only check for the API key if the event is an API request.
    if (triggeredByHttp) {
        const apiKey = event.queryStringParameters?.apiKey;

        if (apiKey !== process.env.TRIGGER_ARI_INGEST_API_KEY) {
            return response.json(401, { message: "Please provide a valid 'apiKey'." });
        }
    }

    // Check if a process is currently running.
    const lastLog = await ingestLogService.getMostRecentLog('ARI', true);
    const dryRun = triggeredByHttp ? !!event.queryStringParameters?.dryRun : false;
    const dryRunMessages: string[] = [];

    if (lastLog && !lastLog.end) {
        if (dryRun) {
            dryRunMessages.push(
                'This run would have been cancelled because another run is currently in progress. However, the run has still been simulated.'
            );
        } else {
            return response.json(202, {
                message: 'Cancelling ingest. Either an import is already in progress or the last import failed.'
            });
        }
    }

    try {
        const ingestResult = await integrationService.incrementalAriIngest(dryRun, 'email');

        return response.json(
            200,
            dryRunMessages.length ? { messages: [...dryRunMessages, ingestResult] } : ingestResult
        );
    } catch (error) {
        console.log(error);

        return response.json(500, { message: 'Unknown server error.' });
    }
};
