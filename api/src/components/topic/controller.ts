import * as I from 'interface';
import * as response from 'lib/response';

import * as topicService from 'topic/service';

export const create = async (event: I.AuthenticatedAPIRequest<I.CreateTopicRequestBody>): Promise<I.JSONResponse> => {
    try {
        const topic = await topicService.create(event.body);

        return response.json(201, topic);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const get = async (event: I.APIRequest<undefined, undefined, I.GetTopicPathParams>): Promise<I.JSONResponse> => {
    try {
        const topic = await topicService.get(event.pathParameters.id);

        if (!topic) {
            return response.json(404, {
                message: 'Topic not found.'
            });
        }

        return response.json(200, topic);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getTopics = async (event: I.APIRequest<undefined, I.TopicsFilters>): Promise<I.JSONResponse> => {
    try {
        const paginatedTopics = await topicService.getPaginatedResults(event.queryStringParameters);

        return response.json(200, paginatedTopics);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};
