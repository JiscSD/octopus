import * as I from 'interface';
import * as integrationService from 'integration/service';
import * as response from 'lib/response';

export const incrementalAriIngest = async (event: I.APIRequest): Promise<I.JSONResponse> => {
    const apiKey = event.queryStringParameters?.apiKey;

    if (apiKey !== process.env.TRIGGER_ARI_INGEST_API_KEY) {
        return response.json(401, { message: "Please provide a valid 'apiKey'." });
    }

    try {
        const userList = await integrationService.incrementalAriIngest();

        return response.json(200, userList);
    } catch (error) {
        console.log(error);

        return response.json(500, { message: 'Unknown server error.' });
    }
};
