import * as I from 'interface';
import * as Helpers from 'lib/helpers';
import * as response from 'lib/response';
import * as bulletinNotification from 'notification/bulletin';
import * as notificationService from 'notification/service';

const triggerScriptApiKey = Helpers.checkEnvVariable('TRIGGER_SCRIPT_API_KEY');

export const create = async (data: {
    userId: string;
    type: I.NotificationTypeEnum;
    actionType: I.NotificationActionTypeEnum;
    payload?: I.NotificationPayload;
}): Promise<I.Notification> => {
    const { userId, type, actionType, payload } = data;
    const notification = await notificationService.create(userId, type, actionType, payload);

    return notification;
};

export const getAll = async (): Promise<I.JSONResponse> => {
    try {
        const notifications = await notificationService.getAll();

        return response.json(200, {
            message: 'Notifications retrieved successfully.',
            data: notifications
        });
    } catch (error) {
        console.error('Error retrieving notifications:', error);

        return response.json(500, {
            message: 'Failed to retrieve notifications.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const sendByType = async (
    type: I.NotificationTypeEnum,
    force: boolean
): Promise<I.NotificationSendBulkResponse> => {
    switch (type) {
        case I.NotificationTypeEnum.BULLETIN:
            return bulletinNotification.sendAll(force);
    }
};

export const sendBulletin = async (
    event: I.APIRequest<undefined, { force: string; apiKey: string }>
): Promise<I.JSONResponse> => {
    // TODO:
    // This is a temporary endpoint for sending bulletin notifications so that we can test it without waiting for the next scheduled run.
    // This endpoint has to be triggered by the cron job only
    const force = event.queryStringParameters?.force === 'true';
    const apiKey = event.queryStringParameters?.apiKey;

    if (triggerScriptApiKey && apiKey !== triggerScriptApiKey) {
        return response.json(403, { message: 'Forbidden: Invalid API key.' });
    }

    try {
        const result = await sendByType(I.NotificationTypeEnum.BULLETIN, force);

        return response.json(200, {
            message: 'Bulletin notifications sent successfully.',
            mode: force ? 'forced' : 'scheduled',
            data: result
        });
    } catch (error) {
        console.error('Error sending bulletin notifications:', error);

        return response.json(500, {
            message: 'Failed to send bulletin notifications.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
