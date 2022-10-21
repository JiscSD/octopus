import * as testUtils from 'lib/testUtils';

describe('get references', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Any user (unauthenticated) can get the references for a live publication', async () => {
        const reference = await testUtils.agent.get('/publications/publication-real-world-application-live/reference');

        expect(reference.status).toEqual(200);
    });
});
