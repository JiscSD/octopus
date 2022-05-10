import middy from '@middy/core';

import * as middleware from 'middleware';

import * as flagController from 'flag/controller';
import * as flagSchema from 'flag/schema';

export const createFlag = middy(flagController.createFlag)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(flagSchema.createFlag, 'body'));

export const createFlagComment = middy(flagController.createFlagComment)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(flagSchema.createFlagComment, 'body'));

export const resolveFlag = middy(flagController.resolveFlag)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());
