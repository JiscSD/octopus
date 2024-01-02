import middy from '@middy/core';

import * as middleware from 'middleware';

import * as additionalInformationController from 'additionalInformation/controller';
import * as additionalInformationSchema from 'additionalInformation/schema';

export const create = middy(additionalInformationController.create)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(additionalInformationSchema.create, 'body'));
