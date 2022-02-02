import middy from '@middy/core';

import * as middleware from 'middleware';

import * as userController from 'user/controller';
import * as userSchema from 'user/schema';

export const getAll = middy(userController.getAll)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.validator(userSchema.getAll, 'queryStringParameters'));

export const get = middy(userController.get)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser());