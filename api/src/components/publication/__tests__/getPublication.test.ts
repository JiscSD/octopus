import * as testUtils from 'lib/testUtils';

describe('View publications + versions', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User who created publication version can see DRAFT versions', async () => {
        const getPublication = await testUtils.agent.get('/publications/publication-1').query({
            apiKey: '123456789'
        });

        expect(getPublication.body.id).toEqual('publication-1');
        expect(getPublication.body.versions.some((version) => version.currentStatus === 'DRAFT'));
    });

    test('User who did not create publication version cannot see DRAFT versions', async () => {
        const getPublication = await testUtils.agent.get('/publications/publication-1').query({
            apiKey: '987654321'
        });

        expect(getPublication.status).toEqual(403);
    });

    test('Cannot view publication version in DRAFT without API key', async () => {
        const getPublication = await testUtils.agent.get('/publications/publication-1').query({
            apiKey: '987654321'
        });

        expect(getPublication.status).toEqual(403);
    });

    test.todo('Any user can see a LIVE publication');
});
