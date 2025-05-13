import middy from '@middy/core';

import * as middleware from 'middleware';

import * as linkController from 'link/controller';
import * as linkSchema from 'link/schema';

export const create = middy(linkController.create)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(linkSchema.create, 'body'));

export const deleteLink = middy(linkController.deleteLink)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());

export const markForDeletion = middy(linkController.markForDeletion)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(linkSchema.markForDeletion, 'body'));
