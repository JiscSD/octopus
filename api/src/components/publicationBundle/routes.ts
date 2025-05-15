import middy from '@middy/core';

import * as middleware from 'middleware';
import * as publicationBundleController from 'publicationBundle/controller';
import * as publicationBundleSchema from 'publicationBundle/schema';

export const create = middy(publicationBundleController.create)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(publicationBundleSchema.create, 'body'));

export const edit = middy(publicationBundleController.edit)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(publicationBundleSchema.edit, 'body'));

export const deletePublicationBundle = middy(publicationBundleController.deletePublicationBundle)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.authentication());

export const get = middy(publicationBundleController.get).use(
    middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true })
);

export const getByUser = middy(publicationBundleController.getByUser)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.authentication())
    .use(middleware.validator(publicationBundleSchema.getByUser, 'queryStringParameters'));
