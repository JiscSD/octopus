import * as I from 'interface';
import * as email from 'lib/email';
import * as Helpers from 'lib/helpers';
import * as notificationService from 'notification/service';
import * as userService from 'user/service';

// Use 6 days + 23 hours instead of exactly 7 days to ensure the condition passes on weekly cron runs
const BULLETIN_DIGEST_DELTA_TIME = 6.9 * 24 * 60 * 60 * 1000;
const BULLETIN_USERS_PER_BATCH = 10;

type BulletinNotifications = Awaited<ReturnType<typeof notificationService.getBulletin>>;

async function sendSingle(
    userId: string,
    userNotifications: BulletinNotifications,
    digestDeltaTime: number,
    force: boolean
): Promise<I.NotificationSendSingleResponse> {
    const response: I.NotificationSendSingleResponse = { error: null, skipped: false };

    if (userNotifications.length === 0) {
        return response;
    }

    const user = await userService.get(userId, true);

    if (!user || !user.email) {
        response.error = new Error(`User with ID ${userId} does not exist or has no email.`);

        return response;
    }

    // skip if the user has already received a bulletin notification within the specified time frame
    if (!force && user.lastBulletinSentAt && user.lastBulletinSentAt.getTime() > Date.now() - digestDeltaTime) {
        response.skipped = true;

        return response;
    }

    // Construct the notifications by action type and user settings
    const notificationsByActionType = userNotifications.reduce((acc, notification) => {
        if (!acc.has(notification.actionType)) {
            acc.set(notification.actionType, []);
        }

        // user.settings?.[field] should be checked against false specifically (opt-out
        // as any other value (undefined, null, etc) should allow the notification (defaults to true)

        switch (notification.actionType) {
            case I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_VERSION_CREATED: {
                if (user.settings?.enableBookmarkVersionNotifications === false) {
                    return acc;
                }

                acc.get(notification.actionType)?.push(notification);
                break;
            }

            case I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_RED_FLAG_RAISED:
                if (user.settings?.enableBookmarkFlagNotifications === false) {
                    return acc;
                }

                acc.get(notification.actionType)?.push(notification);
                break;

            case I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_RED_FLAG_RESOLVED:
                if (user.settings?.enableBookmarkFlagNotifications === false) {
                    return acc;
                }

                acc.get(notification.actionType)?.push(notification);
                break;

            case I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_RED_FLAG_COMMENTED: {
                if (user.settings?.enableBookmarkFlagNotifications === false) {
                    return acc;
                }

                acc.get(notification.actionType)?.push(notification);
                break;
            }
        }

        return acc;
    }, new Map<I.NotificationActionTypeEnum, BulletinNotifications>());

    try {
        await email.notifyBulletin({
            recipientEmail: user.email,
            notificationsByActionType: notificationsByActionType
        });
    } catch (error) {
        response.error = error instanceof Error ? error : new Error('Unknown error occurred while sending email');
        console.error(`Failed to send bulletin notification to user ${userId}:`, response.error);

        return response;
    }

    await userService.updateUser(userId, { lastBulletinSentAt: new Date() });

    return response;
}

async function processBatch(
    userBatch: Array<{ userId: string; notifications: BulletinNotifications }>,
    digestDeltaTime: number,
    sent: BulletinNotifications,
    failed: BulletinNotifications,
    skipped: BulletinNotifications,
    failedUserIds: Set<string>,
    force: boolean
): Promise<{ errors: Error[] }> {
    const errors: Error[] = [];
    // Send notifications to all users in the batch concurrently
    const batchPromises = userBatch.map(async ({ userId, notifications }) => {
        const result = await sendSingle(userId, notifications, digestDeltaTime, force);

        return { userId, notifications, result };
    });

    const results = await Promise.allSettled(batchPromises);

    for (const settlementResult of results) {
        if (settlementResult.status === 'rejected') {
            errors.push(new Error(`Batch processing failed: ${settlementResult.reason}`));
            continue;
        }

        const { userId, notifications, result } = settlementResult.value;

        if (result.error) {
            failedUserIds.add(userId);
            errors.push(result.error);
            failed.push(...notifications);
        } else if (result.skipped) {
            skipped.push(...notifications);
        } else {
            sent.push(...notifications);
        }
    }

    return { errors };
}

export async function sendAll(
    force: boolean,
    digestDeltaTime = BULLETIN_DIGEST_DELTA_TIME
): Promise<I.NotificationSendBulkResponse> {
    const response: I.NotificationSendBulkResponse = { errors: [], totalSent: 0, totalFailed: 0, totalSkipped: 0 };

    const pendingNotifications = await notificationService.getBulletin(I.NotificationStatusEnum.PENDING);

    if (pendingNotifications.length === 0) {
        return response;
    }

    let userNotifications: BulletinNotifications = [];
    const sent: BulletinNotifications = [];
    const failed: BulletinNotifications = [];
    const skipped: BulletinNotifications = [];

    const failedUserIds = new Set<string>();
    const userBatch: Array<{ userId: string; notifications: BulletinNotifications }> = [];

    let userId: string = pendingNotifications[0].userId;

    for (const notification of pendingNotifications) {
        // If a notification has already been sent to this user and failed, skip all subsequent notifications for this user
        if (failedUserIds.has(userId)) {
            continue;
        }

        if (notification.userId !== userId) {
            userBatch.push({ userId, notifications: [...userNotifications] });

            if (userBatch.length >= BULLETIN_USERS_PER_BATCH) {
                const { errors } = await processBatch(
                    userBatch,
                    digestDeltaTime,
                    sent,
                    failed,
                    skipped,
                    failedUserIds,
                    force
                );
                response.errors = response.errors.concat(errors);
                userBatch.length = 0;
            }

            userId = notification.userId;
            userNotifications = [];
        }

        userNotifications.push(notification);
    }

    // Process the last user
    userBatch.push({ userId, notifications: [...userNotifications] });
    const { errors } = await processBatch(userBatch, digestDeltaTime, sent, failed, skipped, failedUserIds, force);
    response.errors = response.errors.concat(errors);

    // Remove sent notifications
    const sentResponse = await Promise.allSettled(sent.map((n) => notificationService.remove(n.id)));

    if (sentResponse.some((res) => res.status === 'rejected')) {
        console.error('Some notifications failed to be removed:', response);
        response.errors.push(new Error('Some notifications failed to be removed'));
    }

    // Update failed notifications to FAILED status
    const failedResponse = await Promise.allSettled(
        failed.map((n) => notificationService.update(n.id, { status: I.NotificationStatusEnum.FAILED }))
    );

    if (failedResponse.some((res) => res.status === 'rejected')) {
        console.error('Some notifications failed to be updated:', response);
        response.errors.push(new Error('Some notifications failed to be updated'));
    }

    response.totalSent = sent.length;
    response.totalFailed = failed.length;
    response.totalSkipped = skipped.length;

    return response;
}

export const createBulletin = async (
    actionType: I.NotificationActionTypeEnum,
    publicationVersion: Pick<I.PublicationVersion, 'title' | 'versionOf'>,
    metadata?: {
        currentUserId?: string;
        flagId?: string;
    }
): Promise<void> => {
    const payload = { title: '', url: '' };

    let usersToBeNotified = await userService.getBookmarkedUsers(publicationVersion.versionOf);
    
    if (metadata?.currentUserId) {
        usersToBeNotified = usersToBeNotified.filter((user) => user.id !== metadata.currentUserId);
    }

    if (actionType === I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_VERSION_CREATED) {
        payload.title = publicationVersion.title ?? '';
        payload.url = Helpers.getPublicationUrl(publicationVersion.versionOf);
    } else if (
        [
            I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_RED_FLAG_RAISED,
            I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_RED_FLAG_RESOLVED,
            I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_RED_FLAG_COMMENTED
        ].includes(actionType)
    ) {
        payload.title = publicationVersion.title ?? '';
        payload.url = `${Helpers.getPublicationUrl(publicationVersion.versionOf)}${
            metadata?.flagId ? `/flag/${metadata.flagId}` : ''
        }`;
    }

    const type = I.NotificationTypeEnum.BULLETIN;

    await notificationService.createMany(
        usersToBeNotified.map((user) => ({ userId: user.id, type, actionType, payload }))
    );
};
