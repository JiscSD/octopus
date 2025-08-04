import * as I from 'interface';
import * as testUtils from 'lib/testUtils';
import * as notificationController from 'notification/controller';

describe('Send notifications', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Send all notifications by bulletin type, outside time window', async () => {
        const payload = { title: 'PUBLICATION TITLE', url: 'https://www.octopus.ac/publications/1/versions/latest' };
        const types = Object.values(I.NotificationTypeEnum);
        const actionTypes = Object.values(I.NotificationActionTypeEnum);
        const userIds = ['test-user-1', 'test-user-2', 'test-organisational-account-1'];

        for (const type of types) {
            for (const actionType of actionTypes) {
                for (const userId of userIds) {
                    await notificationController.create({ type, actionType, payload, userId });
                }
            }
        }

        // Normal (scheduled) send by bulletin type
        const scheduled = await notificationController.sendByType(I.NotificationTypeEnum.BULLETIN);

        expect(scheduled.errors).toHaveLength(1);
        expect(scheduled.errors[0].message).toBe(
            'User with ID test-organisational-account-1 does not exist or has no email.'
        );
        expect(scheduled.totalSent).toBe(2 * types.length * actionTypes.length);
        expect(scheduled.totalFailed).toBe(1 * types.length * actionTypes.length);
        expect(scheduled.totalSkipped).toBe(0);
    });

    test('Send all notifications by bulletin type, inside time window', async () => {
        const payload = { title: 'PUBLICATION TITLE', url: 'https://www.octopus.ac/publications/1/versions/latest' };
        const types = Object.values(I.NotificationTypeEnum);
        const actionTypes = Object.values(I.NotificationActionTypeEnum);
        const userIds = ['test-user-1', 'test-user-2', 'test-organisational-account-1'];

        for (const type of types) {
            for (const actionType of actionTypes) {
                for (const userId of userIds) {
                    await notificationController.create({ type, actionType, payload, userId });
                }
            }
        }

        // We already sent these notifications in the previous test, so they should be skipped
        const preScheduled = await notificationController.sendByType(I.NotificationTypeEnum.BULLETIN);

        expect(preScheduled.errors).toHaveLength(1);
        expect(preScheduled.errors[0].message).toBe(
            'User with ID test-organisational-account-1 does not exist or has no email.'
        );
        expect(preScheduled.totalSent).toBe(0);
        expect(preScheduled.totalFailed).toBe(1 * types.length * actionTypes.length);
        expect(preScheduled.totalSkipped).toBe(2 * types.length * actionTypes.length);

        // Force-send by bulletin type - this should send all skipped notifications
        const forced = await notificationController.sendByType(I.NotificationTypeEnum.BULLETIN, true);

        expect(forced.errors).toHaveLength(0);
        expect(forced.totalSent).toBe(2 * types.length * actionTypes.length);
        expect(forced.totalFailed).toBe(0);
        expect(forced.totalSkipped).toBe(0);
    });
});
