import * as I from 'interface';
import * as email from 'lib/email';
import * as response from 'lib/response';
import * as notificationService from 'notification/service';
import * as userService from 'user/service';

const BULLETIN_DIGEST_DELTA_TIME = 7 * 24 * 60 * 60 * 1000;

type BulkSendResponse = {
    errors: Error[];
    totalSent: number;
    totalFailed: number;
    totalSkipped: number;
};

type SingleSendResponse = {
    error: Error | null;
    skipped: boolean;
};

type BulletinNotifications = Awaited<ReturnType<typeof notificationService.getBulletin>>;

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

async function sendSingleBulletinNotification(
    userId: string,
    userNotifications: BulletinNotifications,
    digestDeltaTime: number
): Promise<SingleSendResponse> {
    const response: SingleSendResponse = { error: null, skipped: false };

    if (userNotifications.length === 0) {
        return response;
    }

    const user = await userService.get(userId, true);

    if (!user || !user.email) {
        response.error = new Error(`User with ID ${userId} does not exist or has no email.`);

        return response;
    }

    // skip if the user has already received a bulletin notification within the specified time frame
    if (user.lastBulletinSentAt && user.lastBulletinSentAt.getTime() > Date.now() - digestDeltaTime) {
        response.skipped = true;

        return response;
    }

    await email.notifyBulletin({ recipientEmail: user.email, notifications: userNotifications });

    await userService.updateUser(userId, { lastBulletinSentAt: new Date() });

    return response;
}

async function sendAllBulletinNotifications(digestDeltaTime: number): Promise<BulkSendResponse> {
    const response: BulkSendResponse = { errors: [], totalSent: 0, totalFailed: 0, totalSkipped: 0 };

    const pendingNotifications = await notificationService.getBulletin(I.NotificationStatusEnum.PENDING);

    if (pendingNotifications.length === 0) {
        return response;
    }

    let userNotifications: BulletinNotifications = [];
    let sentNotifications: BulletinNotifications = [];
    let failedNotifications: BulletinNotifications = [];
    let skippedNotifications: BulletinNotifications = [];

    const failedUserIds = new Set<string>();

    let userId: string = pendingNotifications[0].userId;

    for (const notification of pendingNotifications) {
        // If a notification has already been sent to this user and failed, skip all subsequent notifications for this user
        if (failedUserIds.has(userId)) {
            continue;
        }

        if (notification.userId !== userId) {
            const { error, skipped } = await sendSingleBulletinNotification(userId, userNotifications, digestDeltaTime);

            if (error) {
                failedUserIds.add(userId);
                response.errors.push(error);
                failedNotifications = failedNotifications.concat(userNotifications);
            } else if (skipped) {
                skippedNotifications = skippedNotifications.concat(userNotifications);
            } else {
                sentNotifications = sentNotifications.concat(userNotifications);
            }

            userId = notification.userId;
            userNotifications = [];
        }

        userNotifications.push(notification);
    }

    // Send the last batch of notifications
    const { error, skipped } = await sendSingleBulletinNotification(userId, userNotifications, digestDeltaTime);

    if (error) {
        response.errors.push(error);
        failedNotifications = failedNotifications.concat(userNotifications);
    } else if (skipped) {
        skippedNotifications = skippedNotifications.concat(userNotifications);
    } else {
        sentNotifications = sentNotifications.concat(userNotifications);
    }

    // Remove sent notifications
    const sentResponse = await Promise.allSettled(sentNotifications.map((n) => notificationService.remove(n.id)));

    if (sentResponse.some((res) => res.status === 'rejected')) {
        console.error('Some notifications failed to be removed:', response);
        response.errors.push(new Error('Some notifications failed to be removed'));
    }

    // Update failed notifications to FAILED status
    const failedResponse = await Promise.allSettled(
        failedNotifications.map((n) => notificationService.update(n.id, { status: I.NotificationStatusEnum.FAILED }))
    );

    if (failedResponse.some((res) => res.status === 'rejected')) {
        console.error('Some notifications failed to be updated:', response);
        response.errors.push(new Error('Some notifications failed to be updated'));
    }

    response.totalSent = sentNotifications.length;
    response.totalFailed = failedNotifications.length;
    response.totalSkipped = skippedNotifications.length;

    return response;
}

export const sendByType = async (type: I.NotificationTypeEnum): Promise<BulkSendResponse> => {
    switch (type) {
        case I.NotificationTypeEnum.BULLETIN:
            return sendAllBulletinNotifications(BULLETIN_DIGEST_DELTA_TIME);
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
