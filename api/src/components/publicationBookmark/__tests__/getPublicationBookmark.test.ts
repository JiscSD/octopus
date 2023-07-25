import * as testUtils from 'lib/testUtils';

describe('Get a publication bookmark', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Get a publication bookmark', async () => {
        const bookmark = await testUtils.agent
            .get('/publications/publication-hypothesis-live/bookmark')
            .query({ apiKey: '000000003' });

        expect(bookmark.status).toEqual(200);
    });

    test('You cannot access get a publication bookmark for a publication that does not exist', async () => {
        const bookmark = await testUtils.agent
            .get('/publications/publication-does-not-exist/bookmark')
            .query({ apiKey: '987654321' });

        expect(bookmark.status).toEqual(404);
    });

    test('You cannot get a publication bookmark as an un-authenticated user', async () => {
        const bookmark = await testUtils.agent
            .get('/publications/publication-problem-live/bookmark')
            .query({ apiKey: null });

        expect(bookmark.status).toEqual(401);
    });

    test('You cannot get a publication bookmark for a publication which is in a draft state', async () => {
        const bookmark = await testUtils.agent
            .get('/publications/publication-problem-draft/bookmark')
            .query({ apiKey: '987654321' });

        expect(bookmark.status).toEqual(404);
    });
});
