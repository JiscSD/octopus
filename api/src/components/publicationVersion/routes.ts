import middy from '@middy/core';

import * as middleware from 'middleware';
import * as publicationVersionController from './controller';
import * as publicationVersionSchema from './schema';

export const get = middy(publicationVersionController.get)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication(true));

export const getAll = middy(publicationVersionController.getAll)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.validator(publicationVersionSchema.getAll, 'queryStringParameters'));

export const update = middy(publicationVersionController.update)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(publicationVersionSchema.update, 'body'));

export const updateStatus = middy(publicationVersionController.updateStatus)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(publicationVersionSchema.updateStatusPath, 'pathParameters'))
    .use(middleware.validator(publicationVersionSchema.updateStatusQuery, 'queryStringParameters'));

export const deleteVersion = middy(publicationVersionController.deleteVersion)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());

export const create = middy(publicationVersionController.create)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());

export const requestControl = middy(publicationVersionController.requestControl)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());

export const approveControlRequest = middy(publicationVersionController.approveControlRequest)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(publicationVersionSchema.approveControlRequest, 'body'));
