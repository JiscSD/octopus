import * as testUtils from 'lib/testUtils';

describe('Get links from a supplied publication', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('Responds with 404 for non-existent publication', async () => {
        const getPublication = await testUtils.agent.get('/publications/fake/links');

        expect(getPublication.statusCode).toEqual(404);
    });

    test('Responds with 404 for DRAFT root publication', async () => {
        const getPublication = await testUtils.agent.get('/publications/publication-1/links');

        expect(getPublication.statusCode).toEqual(404);
    });

    test('Responds with 200 and linked publications for LIVE root publication', async () => {
        const getPublication = await testUtils.agent.get(
            '/publications/publication-hypothesis-live-problem-live/links'
        );

        expect(getPublication.statusCode).toEqual(200);
        expect(getPublication.body.linkedFromPublications.length).toBeGreaterThan(0);
        expect(getPublication.body.linkedToPublications.length).toBeGreaterThan(0);
    });
});
