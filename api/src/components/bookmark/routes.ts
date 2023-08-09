import middy from '@middy/core';

import * as middleware from 'middleware';

import * as bookmarkController from 'bookmark/controller';
import * as bookmarkSchema from 'bookmark/schema';

export const create = middy(bookmarkController.create)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(bookmarkSchema.create, 'body'));

export const deleteBookmark = middy(bookmarkController.deleteBookmark)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(bookmarkSchema.deleteBookmark, 'pathParameters'));

export const get = middy(bookmarkController.get)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(bookmarkSchema.get, 'pathParameters'));

export const getAll = middy(bookmarkController.getAll)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(bookmarkSchema.getAll, 'queryStringParameters'));
