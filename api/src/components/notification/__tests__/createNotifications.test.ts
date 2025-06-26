import * as I from 'interface';
import * as testUtils from 'lib/testUtils';
import * as notificationController from 'notification/controller';

describe('Create notifications', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Create notification by type - BULLETIN', async () => {
        const payload = {
            userId: 'test-user-1',
            type: I.NotificationTypeEnum.BULLETIN,
            actionType: I.NotificationActionTypeEnum.PUBLICATION_VERSION_CREATED,
            payload: { title: 'Test bulletin notification' }
        };
        const notification = await notificationController.create(payload);
        expect(notification.status).toEqual(I.NotificationStatusEnum.PENDING);
    });
});
