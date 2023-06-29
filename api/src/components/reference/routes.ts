import middy from '@middy/core';
import * as middleware from 'middleware';
import * as referenceController from 'reference/controller';
import * as referenceSchema from 'reference/schema';

export const get = middy(referenceController.get)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.authentication(true));

export const updateAll = middy(referenceController.updateAll)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.checkOwnership())
    .use(middleware.validator(referenceSchema.updateAll, 'body'));
