import middy from '@middy/core';

import * as middleware from 'middleware';

import * as topicController from 'topic/controller';
import * as topicSchema from 'topic/schema';

export const get = middy(topicController.get)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser());

export const getTopics = middy(topicController.getTopics)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.validator(topicSchema.getTopics, 'queryStringParameters'));
