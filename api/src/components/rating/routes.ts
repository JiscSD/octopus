import middy from '@middy/core';

import * as middleware from 'middleware';
import * as ratingsController from 'rating/controller';
import * as ratingSchema from 'rating/schema';

export const upsert = middy(ratingsController.upsert)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(ratingSchema.upsert, 'body'));
