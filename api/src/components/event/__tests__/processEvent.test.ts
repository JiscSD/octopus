import * as client from 'lib/client';
import * as testUtils from 'lib/testUtils';
import * as eventController from 'event/controller';

describe('Process events', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
    });

    test('Process a dummy event', async () => {
        const data = {
            to: 'test.example@domain.com'
        };
        await client.prisma.event.create({
            data: {
                type: 'dummy',
                data
            }
        });
        const processEvents = await eventController.dailyEventCheck();
        expect(processEvents.body).toEqual(JSON.stringify({ message: 'Processed 1 event' }));
    });
});
