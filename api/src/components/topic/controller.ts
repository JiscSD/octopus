import * as I from 'interface';
import * as response from 'lib/response';

import * as topicService from 'topic/service';

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreateTopicRequestBody>
): Promise<I.JSONResponse> => {
    try {
        const topic = await topicService.create(event.body);

        return response.json(201, topic);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};