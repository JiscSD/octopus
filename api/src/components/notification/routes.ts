import middy from '@middy/core';
import * as Helpers from 'lib/helpers';
import * as middleware from 'middleware';
import * as notificationController from 'notification/controller';
import * as notificationSchema from 'notification/schema';

const triggerScriptApiKey = Helpers.checkEnvVariable('TRIGGER_SCRIPT_API_KEY');

export const getAll = middy(notificationController.getAll)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.authentication(false, false, triggerScriptApiKey))
    .use(middleware.validator(notificationSchema.getAllNotifications, 'queryStringParameters'));

export const sendBulletin = middy(notificationController.sendBulletin)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.authentication(false, false, triggerScriptApiKey))
    .use(middleware.validator(notificationSchema.sendAllNotifications, 'queryStringParameters'));

export const clearFailed = middy(notificationController.clearFailedNotifications)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.authentication(false, false, triggerScriptApiKey))
    .use(middleware.validator(notificationSchema.clearFailedNotifications, 'queryStringParameters'));

export const sendBulletinCron = middy(notificationController.sendBulletin).use(
    middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true })
);
