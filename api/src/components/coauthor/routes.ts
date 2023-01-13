import middy from '@middy/core';

import * as middleware from 'middleware';

import * as coAuthorController from 'coauthor/controller';
import * as coAuthorSchema from 'coauthor/schema';

export const create = middy(coAuthorController.create)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(coAuthorSchema.create, 'body'));

export const remove = middy(coAuthorController.remove)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());

export const link = middy(coAuthorController.link)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication(true))
    .use(middleware.validator(coAuthorSchema.link, 'body'));

export const updateConfirmation = middy(coAuthorController.updateConfirmation)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(coAuthorSchema.updateConfirmation, 'body'));
