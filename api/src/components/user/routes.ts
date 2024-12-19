import middy from '@middy/core';

import * as Helpers from 'lib/helpers';
import * as middleware from 'middleware';
import * as userController from 'user/controller';
import * as userSchema from 'user/schema';

export const getAll = middy(userController.getAll)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.validator(userSchema.getAll, 'queryStringParameters'));

export const get = middy(userController.get)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication(true));

export const getPublications = middy(userController.getPublications)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication(true))
    .use(middleware.validator(userSchema.getPublications, 'queryStringParameters'));

export const getUserList = middy(userController.getUserList)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.authentication(false, false, Helpers.checkEnvVariable('LIST_USERS_API_KEY')));

export const getUserControlRequests = middy(userController.getUserControlRequests)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());
