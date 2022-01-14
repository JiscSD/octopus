import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';

import * as controller from './controller';
// import * as middleware from 'middleware';
// import * as schema from './schema';

export const getAll = middy(controller.getAll)
    .use(doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(httpJsonBodyParser());
