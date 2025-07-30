import * as I from 'interface';
import * as testUtils from 'lib/testUtils';
import * as notificationController from 'notification/controller';

describe('Send notifications', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Send all notifications by bulletin type, outside time window', async () => {
        const payload = {
            type: I.NotificationTypeEnum.BULLETIN,
            actionType: I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_VERSION_CREATED,
            payload: { title: 'PUBLICATION TITLE' }
        };

        for (let i = 0; i < 30; i++) {
            await notificationController.create({ ...payload, userId: 'test-user-1' });
            await notificationController.create({ ...payload, userId: 'test-user-2' });
            await notificationController.create({ ...payload, userId: 'test-organisational-account-1' });
        }

        const result = await notificationController.sendByType(I.NotificationTypeEnum.BULLETIN);

        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toBe(
            'User with ID test-organisational-account-1 does not exist or has no email.'
        );
        expect(result.totalSent).toBe(60);
        expect(result.totalFailed).toBe(30);
        expect(result.totalSkipped).toBe(0);
    });

    test('Send all notifications by bulletin type, inside time window', async () => {
        const payload = {
            type: I.NotificationTypeEnum.BULLETIN,
            actionType: I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_VERSION_CREATED,
            payload: { title: 'PUBLICATION TITLE' }
        };

        for (let i = 0; i < 30; i++) {
            await notificationController.create({ ...payload, userId: 'test-user-1' });
            await notificationController.create({ ...payload, userId: 'test-user-2' });
            await notificationController.create({ ...payload, userId: 'test-organisational-account-1' });
        }

        const result = await notificationController.sendByType(I.NotificationTypeEnum.BULLETIN);

        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toBe(
            'User with ID test-organisational-account-1 does not exist or has no email.'
        );
        expect(result.totalSent).toBe(0);
        expect(result.totalFailed).toBe(30);
        expect(result.totalSkipped).toBe(60);
    });
});
