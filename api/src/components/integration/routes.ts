import middy from '@middy/core';

import * as integrationController from 'integration/controller';
import * as integrationSchema from 'integration/schema';
import * as middleware from 'middleware';

export const incrementalAriIngest = middy(integrationController.incrementalAriIngest)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.validator(integrationSchema.incrementalAriIngestHttp, 'queryStringParameters'));
