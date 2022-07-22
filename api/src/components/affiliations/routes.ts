import middy from '@middy/core';

import * as middleware from 'middleware';

import * as affiliationController from './controller';
import * as affiliationSchema from './schema';

export const create = middy(affiliationController.create)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(affiliationSchema.create, 'body'));

export const destroy = middy(affiliationController.destroy)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());
