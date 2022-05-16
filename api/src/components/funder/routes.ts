import middy from '@middy/core';

import * as middleware from 'middleware';

import * as funderController from 'funder/controller';
import * as funderSchema from 'funder/schema';

export const create = middy(funderController.create)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(funderSchema.create, 'body'));

export const destroy = middy(funderController.destroy)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());
