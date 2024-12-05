import * as testUtils from 'lib/testUtils';

describe('View publications + versions', () => {
    beforeAll(async () => {
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

    test('Any user can see LIVE publication versions', async () => {
        const getPublication = await testUtils.agent.get('/publications/publication-problem-live');

        expect(getPublication.status).toEqual(200);
        expect(getPublication.body.versions.every((version) => version.currentStatus === 'LIVE')).toEqual(true);
    });

    test('GET publication endpoint supports partial response query', async () => {
        const getPublication = await testUtils.agent.get(
            '/publications/publication-problem-live?fields=id,type,versions(id,title)'
        );

        expect(getPublication.status).toEqual(200);

        expect(Object.keys(getPublication.body).length).toEqual(3);
        expect(Object.keys(getPublication.body).every((key) => ['id', 'type', 'versions'].includes(key)));
        expect(Object.keys(getPublication.body.versions[0]).length).toEqual(2);
        expect(Object.keys(getPublication.body.versions[0]).every((key) => ['id', 'title'].includes(key)));
    });
});
