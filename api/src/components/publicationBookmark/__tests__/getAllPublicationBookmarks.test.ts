import * as testUtils from 'lib/testUtils';

describe('Get all publication bookmarks', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Get all publication bookmarks', async () => {
        const bookmark = await testUtils.agent.get('/publications/bookmarks').query({ apiKey: '000000003' });

        expect(bookmark.status).toEqual(200);
        expect(bookmark.body).toHaveLength(2);
    });

    test('You cannot access publication bookmarks as an un-authenticated user', async () => {
        const bookmark = await testUtils.agent.get('/publications/bookmarks').query({ apiKey: null });

        expect(bookmark.status).toEqual(401);
    });
});
