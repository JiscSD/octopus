import * as I from 'interface';
import * as testUtils from 'lib/testUtils';
import * as notificationController from 'notification/controller';

describe('Send notifications', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Send all notifications by type - BULLETIN', async () => {
        const payload = {
            type: I.NotificationTypeEnum.BULLETIN,
            actionType: I.NotificationActionTypeEnum.PUBLICATION_VERSION_CREATED,
            payload: { title: 'Test bulletin notification' }
        };

        for (let i = 0; i < 5; i++) {
            await notificationController.create({ ...payload, userId: 'test-user-1' });
            await notificationController.create({ ...payload, userId: 'test-user-2' });
            await notificationController.create({ ...payload, userId: 'test-organisational-account-1' });
        }

        const result = await notificationController.sendAllByType(I.NotificationTypeEnum.BULLETIN);

        expect(result.error).toEqual(null);
        expect(result.totalSent).toBe(10);
        expect(result.totalFailed).toBe(5);
    });
});
