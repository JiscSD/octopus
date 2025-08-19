import * as I from 'interface';
import * as testUtils from 'lib/testUtils';
import * as notificationController from 'notification/controller';

describe('Create notifications', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    const types = Object.values(I.NotificationTypeEnum);
    const actionTypes = Object.values(I.NotificationActionTypeEnum);
    const userIds = ['test-user-1', 'test-user-2', 'test-organisational-account-1'];

    for (const type of types) {
        for (const actionType of actionTypes) {
            for (const userId of userIds) {
                test(`Create notification by ${type} type, ${actionType}, with payload`, async () => {
                    const payload = {
                        type,
                        actionType,
                        userId,
                        payload: {
                            title: 'PUBLICATION TITLE',
                            url: 'https://www.octopus.ac/publications/1/versions/latest'
                        }
                    };

                    const notifications = await Promise.all(
                        Array.from({ length: 30 }, () => notificationController.create(payload))
                    );

                    notifications.forEach((notification) => {
                        expect(notification.status).toEqual(I.NotificationStatusEnum.PENDING);
                    });
                });

                test(`Create notification by ${type} type, ${actionType}, no payload`, async () => {
                    const payload = { type, actionType, userId };
                    const notifications = await Promise.all(
                        Array.from({ length: 30 }, () => notificationController.create(payload))
                    );

                    notifications.forEach((notification) => {
                        expect(notification.status).toEqual(I.NotificationStatusEnum.PENDING);
                    });
                });
            }
        }
    }
});
