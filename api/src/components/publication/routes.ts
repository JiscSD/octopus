import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';

export const getAll = middy(publicationController.getAll)
    .use(doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(httpJsonBodyParser())
    .use(middleware.validator(schemas.createAccount, 'body'));