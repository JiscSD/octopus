import middy from '@middy/core';

import * as middleware from 'middleware';

import * as topicController from 'topic/controller';
import * as topicSchema from 'topic/schema';

export const create = middy(topicController.create)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(topicSchema.create, 'body'));

export const get = middy(topicController.get)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication(true));
