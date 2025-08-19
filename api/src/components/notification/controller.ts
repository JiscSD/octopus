import * as I from 'interface';
import * as response from 'lib/response';
import * as bulletinNotification from 'notification/bulletin';
import * as notificationService from 'notification/service';

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
    force = false
): Promise<I.NotificationSendBulkResponse> => {
    switch (type) {
        case I.NotificationTypeEnum.BULLETIN:
            return bulletinNotification.sendAll(force);
    }
};

export const sendBulletin = async (
    event: I.APIRequest<undefined, I.TriggerNotificationsQueryParams>
): Promise<I.JSONResponse> => {
    const force = event.queryStringParameters?.force === true;

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

export const clearFailedNotifications = async (): Promise<I.JSONResponse> => {
    try {
        const result = await notificationService.clearFailedNotifications();

        return response.json(200, {
            message: 'Failed notifications cleared successfully.',
            data: result
        });
    } catch (error) {
        console.error('Error clearing failed notifications:', error);

        return response.json(500, {
            message: 'Failed to clear failed notifications.',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
