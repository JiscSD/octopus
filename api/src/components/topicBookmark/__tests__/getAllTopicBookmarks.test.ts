import * as testUtils from 'lib/testUtils';

describe('Get all topic bookmarks', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Get all topic bookmarks', async () => {
        const bookmark = await testUtils.agent.get('/topics/bookmarks').query({ apiKey: '987654321' });

        expect(bookmark.status).toEqual(200);
        expect(bookmark.body).toHaveLength(2);
    });

    test('Cannot access topic bookmarks as an un-authenticated user', async () => {
        const bookmark = await testUtils.agent.get('/topics/bookmarks').query({ apiKey: null });

        expect(bookmark.status).toEqual(401);
    });
});
