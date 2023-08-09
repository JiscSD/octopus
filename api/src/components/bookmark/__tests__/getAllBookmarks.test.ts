import * as testUtils from 'lib/testUtils';

describe('Get all bookmarks', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Get all bookmarks', async () => {
        const bookmarks = await testUtils.agent.get('/bookmarks').query({ apiKey: '987654321' });

        expect(bookmarks.status).toEqual(200);
        expect(bookmarks.body).toHaveLength(3);
    });

    test('Get all bookmarks of a given type', async () => {
        const bookmarks = await testUtils.agent.get('/bookmarks').query({ apiKey: '987654321', type: 'TOPIC' });

        expect(bookmarks.status).toEqual(200);
        expect(bookmarks.body).toHaveLength(2);
    });

    test('Cannot access bookmarks as an un-authenticated user', async () => {
        const bookmark = await testUtils.agent.get('/bookmarks').query({ apiKey: null });

        expect(bookmark.status).toEqual(401);
    });
});
