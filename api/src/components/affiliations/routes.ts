import middy from '@middy/core';

import * as middleware from 'middleware';
import * as affiliationController from './controller';

export const getORCIDAffiliations = middy(affiliationController.getOrcidAffiliations).use(middleware.authentication());
