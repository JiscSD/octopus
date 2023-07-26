import * as testUtils from 'lib/testUtils';

describe('Get a topic bookmark', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Get a topic bookmark', async () => {
        const bookmark = await testUtils.agent.get('/topics/test-topic-1/bookmark').query({ apiKey: '987654321' });

        expect(bookmark.status).toEqual(200);
    });

    test('Cannot get a bookmark for a topic that does not exist', async () => {
        const bookmark = await testUtils.agent
            .get('/topics/topic-that-does-not-exist/bookmark')
            .query({ apiKey: '987654321' });

        expect(bookmark.status).toEqual(404);
    });

    test('Cannot get a topic bookmark as an un-authenticated user', async () => {
        const bookmark = await testUtils.agent.get('/topics/test-topic-1/bookmark').query({ apiKey: null });

        expect(bookmark.status).toEqual(401);
    });
});
