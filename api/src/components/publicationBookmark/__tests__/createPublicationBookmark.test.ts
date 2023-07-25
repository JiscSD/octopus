import * as testUtils from 'lib/testUtils';

describe('create a publication bookmark', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Create a publication bookmark', async () => {
        const bookmark = await testUtils.agent
            .post('/publications/publication-problem-live/bookmark')
            .query({ apiKey: '000000003' });

        expect(bookmark.status).toEqual(200);
    });

    test('Cannot create a publication bookmark as an un-authenticated user', async () => {
        const bookmark = await testUtils.agent
            .post('/publications/publication-problem-live/bookmark')
            .query({ apiKey: null });

        expect(bookmark.status).toEqual(401);
    });

    test('Cannot create a publication bookmark if the user is the author of the publication', async () => {
        const bookmark = await testUtils.agent
            .post('/publications/publication-problem-live/bookmark')
            .query({ apiKey: '123456789' });

        expect(bookmark.status).toEqual(401);
    });

    test('Cannot create a publication bookmark if the user is a coauthor of the publication', async () => {
        const bookmark = await testUtils.agent
            .post('/publications/publication-problem-live/bookmark')
            .query({ apiKey: '000000006' });

        expect(bookmark.status).toEqual(401);
    });

    test('Cannot create a publication bookmark on a publication that is not live', async () => {
        const bookmark = await testUtils.agent
            .post('/publications/publication-problem-draft/bookmark')
            .query({ apiKey: '000000003' });

        expect(bookmark.status).toEqual(403);
    });

    test('Cannot create two publication bookmarks on the same publication as one user', async () => {
        const bookmark = await testUtils.agent
            .post('/publications/publication-problem-live/bookmark')
            .query({ apiKey: '987654321' });

        expect(bookmark.status).toEqual(404);
    });

    test('Cannot create publication bookmarks a publication that does not exist', async () => {
        const bookmark = await testUtils.agent
            .post('/publications/made-up-publication/bookmark')
            .query({ apiKey: '123456789' });

        expect(bookmark.status).toEqual(404);
    });
});
