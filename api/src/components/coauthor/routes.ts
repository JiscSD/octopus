import middy from '@middy/core';

import * as middleware from 'middleware';
import * as coAuthorController from 'coAuthor/controller';
import * as coAuthorSchema from 'coAuthor/schema';

export const get = middy(coAuthorController.get)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());

export const updateAll = middy(coAuthorController.updateAll)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(coAuthorSchema.updateAll, 'body'));

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

export const requestApproval = middy(coAuthorController.requestApproval)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());

export const sendApprovalReminder = middy(coAuthorController.sendApprovalReminder)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(coAuthorSchema.sendApprovalReminder, 'pathParameters'));
