import * as testUtils from 'lib/testUtils';

describe('Create a bookmark', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Create a bookmark', async () => {
        const bookmark = await testUtils.agent.post('/bookmarks').query({ apiKey: '000000003' }).send({
            type: 'TOPIC',
            entityId: 'test-topic-1'
        });

        expect(bookmark.status).toEqual(201);
    });

    test('Cannot create a bookmark as an un-authenticated user', async () => {
        const bookmark = await testUtils.agent.post('/bookmarks').query({ apiKey: null }).send({
            type: 'TOPIC',
            entityId: 'test-topic-1'
        });

        expect(bookmark.status).toEqual(401);
    });

    test('Cannot create a bookmark where one already exists', async () => {
        const bookmark = await testUtils.agent.post('/bookmarks').query({ apiKey: '987654321' }).send({
            type: 'TOPIC',
            entityId: 'test-topic-1'
        });

        expect(bookmark.status).toEqual(400);
    });

    test('Cannot create a bookmark for an entity that does not exist', async () => {
        const bookmark = await testUtils.agent.post('/bookmarks').query({ apiKey: '123456789' }).send({
            type: 'TOPIC',
            entityId: 'made-up-topic'
        });

        expect(bookmark.status).toEqual(404);
    });

    test('Cannot create a publication bookmark if the user is the author of the publication', async () => {
        const bookmark = await testUtils.agent.post('/bookmarks').query({ apiKey: '123456789' }).send({
            type: 'PUBLICATION',
            entityId: 'publication-problem-live'
        });

        expect(bookmark.status).toEqual(401);
    });

    test('Cannot create a publication bookmark if the user is a coauthor of the publication', async () => {
        const bookmark = await testUtils.agent.post('/bookmarks').query({ apiKey: '000000006' }).send({
            type: 'PUBLICATION',
            entityId: 'publication-problem-live'
        });

        expect(bookmark.status).toEqual(401);
    });

    test('Cannot create a bookmark on a publication that is not live', async () => {
        const bookmark = await testUtils.agent.post('/bookmarks').query({ apiKey: '000000003' }).send({
            type: 'PUBLICATION',
            entityId: 'publication-problem-draft'
        });

        expect(bookmark.status).toEqual(403);
    });
});
