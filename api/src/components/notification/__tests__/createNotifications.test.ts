import * as I from 'interface';
import * as testUtils from 'lib/testUtils';
import * as notificationController from 'notification/controller';

describe('Create notifications', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    Object.values(I.NotificationTypeEnum).forEach((type) => {
        Object.values(I.NotificationActionTypeEnum).forEach((actionType, index) => {
            test(`Create notification by ${type} type, ${actionType}, with payload`, async () => {
                const payload = {
                    type,
                    actionType,
                    userId: `test-user-${index + 1}`,
                    payload: { title: 'PUBLICATION TITLE' }
                };
                const notification = await notificationController.create(payload);
                expect(notification.status).toEqual(I.NotificationStatusEnum.PENDING);
            });

            test(`Create notification by ${type} type, ${actionType}, no payload`, async () => {
                const payload = { type, actionType, userId: `test-user-${index + 1}` };
                const notification = await notificationController.create(payload);
                expect(notification.status).toEqual(I.NotificationStatusEnum.PENDING);
            });
        });
    });
});
