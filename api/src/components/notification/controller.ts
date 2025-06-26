import * as notificationService from 'notification/service';
import * as userService from 'user/service';
import * as I from 'interface';

const BULLETIN_DIGEST_DELTA_TIME = 7 * 24 * 60 * 60 * 1000;

type BulkSendResponse = {
    error: Error | null;
    totalSent: number;
    totalFailed: number;
};

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

async function sendBulletinNotification(): Promise<void> {
    // TODO https://jiscdev.atlassian.net/browse/OC-1078:
    // Generate the email template using the user notifications + the actionType
    // Send the email template using a mail service
}

async function sendAllBulletinNotifications(
    type: I.NotificationTypeEnum,
    digestDeltaTime: number
): Promise<BulkSendResponse> {
    const response: BulkSendResponse = { error: null, totalSent: 0, totalFailed: 0 };

    const pendingNotifications = await notificationService.getBulletin(I.NotificationStatusEnum.PENDING);
    const failedNotificationsIds: string[] = [];

    const notificationsByUserId = new Map<string, Awaited<ReturnType<typeof notificationService.getBulletin>>>();

    for (const notification of pendingNotifications) {
        if (!notificationsByUserId.has(notification.userId)) {
            notificationsByUserId.set(notification.userId, []);
        }

        notificationsByUserId.get(notification.userId)?.push(notification);
    }

    for (const [userId, userNotifications] of notificationsByUserId.entries()) {
        const user = await userService.get(userId, true);

        if (!user || !user.email) {
            failedNotificationsIds.push(...userNotifications.map((n) => n.id));
            continue;
        }

        if (user.lastBulletinSentAt && user.lastBulletinSentAt.getTime() > Date.now() - digestDeltaTime) {
            continue;
        }

        await sendBulletinNotification();
        response.totalSent += userNotifications.length;

        await userService.updateUser(userId, { lastBulletinSentAt: new Date() });

        await Promise.all(userNotifications.map((n) => notificationService.remove(n.id)));
    }

    await Promise.all(
        failedNotificationsIds.map((id) => notificationService.update(id, { status: I.NotificationStatusEnum.FAILED }))
    );

    response.totalFailed = failedNotificationsIds.length;

    return response;
}

export const sendAllByType = async (type: I.NotificationTypeEnum): Promise<BulkSendResponse> => {
    switch (type) {
        case I.NotificationTypeEnum.BULLETIN:
            return sendAllBulletinNotifications(type, BULLETIN_DIGEST_DELTA_TIME);
    }
};
