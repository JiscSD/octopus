import middy from '@middy/core';

import * as middleware from 'middleware';
import * as verificationController from 'verification/controller';

export const requestCode = middy(verificationController.requestCode)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication(true));

export const confirmCode = middy(verificationController.confirmCode)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication(true));
