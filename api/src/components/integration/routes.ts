import middy from '@middy/core';

import * as Helpers from 'lib/helpers';
import * as integrationController from 'integration/controller';
import * as integrationSchema from 'integration/schema';
import * as middleware from 'middleware';

const triggerAriIngestApiKey = Helpers.checkEnvVariable('TRIGGER_ARI_INGEST_API_KEY');

export const triggerARIIngest = middy(integrationController.triggerAriIngest)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.authentication(false, false, triggerAriIngestApiKey))
    .use(middleware.validator(integrationSchema.triggerAriIngest, 'queryStringParameters'));
