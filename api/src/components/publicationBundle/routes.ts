import middy from '@middy/core';

import * as middleware from 'middleware';
import * as publicationBundleController from 'publicationBundle/controller';
import * as publicationBundleSchema from 'publicationBundle/schema';

export const create = middy(publicationBundleController.create)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(publicationBundleSchema.create, 'body'));
