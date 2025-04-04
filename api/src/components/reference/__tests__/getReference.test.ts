import * as testUtils from 'lib/testUtils';

describe('get references', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Any user (unauthenticated) can get the references for a live publication', async () => {
        const reference = await testUtils.agent.get(
            '/publication-versions/publication-real-world-application-live-v1/references'
        );

        expect(reference.status).toEqual(200);
    });
});
