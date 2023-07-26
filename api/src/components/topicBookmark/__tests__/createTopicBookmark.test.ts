import * as testUtils from 'lib/testUtils';

describe('Create a topic bookmark', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Create a topic bookmark', async () => {
        const bookmark = await testUtils.agent.post('/topics/test-topic-1/bookmark').query({ apiKey: '000000003' });

        expect(bookmark.status).toEqual(200);
    });

    test('Cannot create a topic bookmark as an un-authenticated user', async () => {
        const bookmark = await testUtils.agent.post('/topics/test-topic-1/bookmark').query({ apiKey: null });

        expect(bookmark.status).toEqual(401);
    });

    test('Cannot create a topic bookmark where one already exists', async () => {
        const bookmark = await testUtils.agent.post('/topics/test-topic-1/bookmark').query({ apiKey: '987654321' });

        expect(bookmark.status).toEqual(400);
    });

    test('Cannot create a topic bookmarks on a topic that does not exist', async () => {
        const bookmark = await testUtils.agent.post('/topics/made-up-topic/bookmark').query({ apiKey: '123456789' });

        expect(bookmark.status).toEqual(404);
    });
});
