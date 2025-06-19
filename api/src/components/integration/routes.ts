import middy from '@middy/core';

import * as Helpers from 'lib/helpers';
import * as integrationController from 'integration/controller';
import * as integrationSchema from 'integration/schema';
import * as middleware from 'middleware';

const triggerScriptApiKey = Helpers.checkEnvVariable('TRIGGER_SCRIPT_API_KEY');

export const triggerAriIngest = middy(integrationController.triggerAriIngest)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.authentication(false, false, triggerScriptApiKey))
    .use(middleware.validator(integrationSchema.triggerAriIngest, 'queryStringParameters'));

export const triggerAriArchivedCheck = middy(integrationController.triggerAriArchivedCheck)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.authentication(false, false, triggerScriptApiKey))
    .use(middleware.validator(integrationSchema.triggerAriArchivedCheck, 'queryStringParameters'));
