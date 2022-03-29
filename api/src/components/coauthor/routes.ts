import middy from '@middy/core';

import * as middleware from 'middleware';

import * as coAuthorController from './controller';
import * as coAuthorSchema from './schema';

export const create = middy(coAuthorController.create)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(coAuthorSchema.create, 'body'));

export const deleteCoAuthor = middy(coAuthorController.deleteCoAuthor)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());

export const resendCoAuthor = middy(coAuthorController.resendCoAuthor)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());

export const confirmCoAuthor = middy(coAuthorController.confirmCoAuthor)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());

export const resetCoAuthors = middy(coAuthorController.resetCoAuthors)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());
