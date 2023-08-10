import middy from '@middy/core';

import * as middleware from 'middleware';

import * as publicationController from 'publication/controller';
import * as publicationSchema from 'publication/schema';

export const getAll = middy(publicationController.getAll)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.validator(publicationSchema.getAll, 'queryStringParameters'));

export const get = middy(publicationController.get)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication(true));

export const getSeedDataPublications = middy(publicationController.getSeedDataPublications)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser());

export const create = middy(publicationController.create)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(publicationSchema.create, 'body'));

export const update = middy(publicationController.update)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(publicationSchema.update, 'body'));

export const deletePublication = middy(publicationController.deletePublication)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());

export const updateStatus = middy(publicationController.updateStatus)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(publicationSchema.updateStatus, 'pathParameters'));

export const getPublicationLinks = middy(publicationController.getLinksForPublication)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication(true));

export const getPDF = middy(publicationController.getPDF)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.validator(publicationSchema.getPDF, 'pathParameters'));

export const getResearchTopics = middy(publicationController.getResearchTopics).use(
    middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true })
);
