import middy from '@middy/core';

import * as middleware from 'middleware';
import * as affiliationController from './controller';
import * as affiliationSchema from './schema';

export const updateAffiliations = middy(affiliationController.updateAffiliations)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(affiliationSchema.updateAffiliations, 'body'));

export const getORCIDAffiliations = middy(affiliationController.getOrcidAffiliations).use(middleware.authentication());
