import * as I from 'interface';
import * as ingestLogService from 'ingestLog/service';
import * as integrationService from 'integration/service';
import * as response from 'lib/response';

export const incrementalAriIngest = async (
    event: I.APIRequest | I.EventBridgeEvent<'Scheduled Event', string>
): Promise<I.JSONResponse> => {
    // Check if a process is currently running.
    const lastLog = await ingestLogService.getMostRecentLog('ARI', true);
    const triggeredByHttp = event && 'headers' in event;
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

export const triggerECSTask = async (): Promise<I.JSONResponse> => {
    const triggerTaskOutput = await integrationService.triggerECSTask();

    return response.json(200, { message: triggerTaskOutput });
};
