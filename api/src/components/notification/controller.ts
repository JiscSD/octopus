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

export const sendByType = async (type: I.NotificationTypeEnum): Promise<I.NotificationSendBulkResponse> => {
    switch (type) {
        case I.NotificationTypeEnum.BULLETIN:
            return bulletinNotification.sendAll();
    }
};

export const sendBulletin = async (): Promise<I.JSONResponse> => {
    try {
        const result = await sendByType(I.NotificationTypeEnum.BULLETIN);

        return response.json(200, {
            message: 'Bulletin notifications sent successfully.',
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
