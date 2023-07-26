import * as testUtils from 'lib/testUtils';
import * as client from 'lib/client';

describe('Remove a topic bookmark', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Delete a topic bookmark', async () => {
        const bookmark = await testUtils.agent.delete('/topics/test-topic-1a/bookmark').query({ apiKey: '987654321' });

        const checkForBookmark = await client.prisma.topicBookmark.findFirst({
            where: {
                topicId: 'test-topic-1a',
                userId: '987654321'
            }
        });

        expect(bookmark.status).toEqual(200);
        expect(checkForBookmark).toEqual(null);
    });

    test('Cannot delete a topic bookmark as an un-authenticated user', async () => {
        const bookmark = await testUtils.agent.delete('/topics/test-topic-1/bookmark').query({ apiKey: null });

        expect(bookmark.status).toEqual(401);
    });

    test('Cannot delete a topic bookmark that does not exist', async () => {
        const bookmark = await testUtils.agent.delete('/topics/test-topic-1b/bookmark').query({ apiKey: '123456789' });

        expect(bookmark.status).toEqual(404);
    });
});
