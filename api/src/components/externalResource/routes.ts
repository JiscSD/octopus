import middy from '@middy/core';

import * as middleware from 'middleware';

import * as externalResourceController from 'externalResource/controller';
import * as externalResourceSchema from 'externalResource/schema';

export const create = middy(externalResourceController.create)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(externalResourceSchema.create, 'body'));
