import middy from '@middy/core';

import * as middleware from 'middleware';

import * as authorizationController from 'authorization/controller';
import * as authorizationSchema from 'authorization/schema';

export const authorize = middy(authorizationController.authorize)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.validator(authorizationSchema.authorize, 'body'));

export const verifyToken = middy(authorizationController.verifyToken)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.authentication());
