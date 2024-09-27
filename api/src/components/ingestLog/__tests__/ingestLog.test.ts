import * as client from 'lib/client';
import * as ingestLogService from 'ingestLog/service';
import * as testUtils from 'lib/testUtils';

beforeEach(async () => {
    await testUtils.clearDB();
    await testUtils.testSeed();
});

describe('Ingest log functions', () => {
    test('Create an ingest log', async () => {
        const createLog = await ingestLogService.create('ARI');
        expect(createLog.source).toEqual('ARI');
        expect(createLog.start).toBeInstanceOf(Date);
        expect(createLog.end).toBeNull();
    });

    test('Set the end time of an ingest log', async () => {
        const now = new Date();
        const setEndTime = await ingestLogService.setEndTime('ingest-log-1', now);
        expect(setEndTime).toMatchObject({
            id: 'ingest-log-1',
            start: new Date('2024-09-11T12:53:00.000Z'),
            end: now,
            source: 'ARI'
        });
    });

    test('Get most recent log', async () => {
        const mostRecentLog = await ingestLogService.getMostRecentLog('ARI');
        expect(mostRecentLog?.start).toEqual(new Date('2024-09-11T12:53:00.000Z'));
    });

    test('Most recent start is null if no run that ended successfully is present', async () => {
        await client.prisma.ingestLog.update({ where: { id: 'ingest-log-1' }, data: { end: null } });
        const mostRecentStart = await ingestLogService.getMostRecentLog('ARI');
        expect(mostRecentStart).toBeNull();
    });
});
