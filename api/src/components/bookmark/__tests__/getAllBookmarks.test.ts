import * as testUtils from 'lib/testUtils';

describe('Get all bookmarks', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Get a bookmark', async () => {
        const bookmark = await testUtils.agent.get('/bookmarks').query({ apiKey: '000000003' });

        expect(bookmark.status).toEqual(200);
        expect(bookmark.body).toHaveLength(2);
    });

    test('You cannot access bookmarks as an un-authenticated user', async () => {
        const bookmark = await testUtils.agent.get('/bookmarks').query({ apiKey: null });

        expect(bookmark.status).toEqual(401);
    });
});
