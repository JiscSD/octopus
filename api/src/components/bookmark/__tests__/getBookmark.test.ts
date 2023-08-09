import * as testUtils from 'lib/testUtils';

describe('Get a bookmark', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Get a bookmark', async () => {
        const bookmark = await testUtils.agent.get('/bookmarks/topic/test-topic-1').query({ apiKey: '987654321' });

        expect(bookmark.status).toEqual(200);
    });

    test('Cannot get a bookmark for an entity that does not exist', async () => {
        const bookmark = await testUtils.agent
            .get('/bookmarks/topic/topic-that-does-not-exist')
            .query({ apiKey: '987654321' });

        expect(bookmark.status).toEqual(404);
    });

    test('Cannot get a bookmark as an un-authenticated user', async () => {
        const bookmark = await testUtils.agent.get('/bookmarks/topic/test-topic-1').query({ apiKey: null });

        expect(bookmark.status).toEqual(401);
    });

    test('Cannot get a bookmark for a publication which is in a draft state', async () => {
        const bookmark = await testUtils.agent
            .get('/bookmarks/publication/publication-problem-draft')
            .query({ apiKey: '987654321' });

        expect(bookmark.status).toEqual(404);
    });
});
