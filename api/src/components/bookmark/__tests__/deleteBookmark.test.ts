import * as testUtils from 'lib/testUtils';
import * as client from 'lib/client';

describe('Delete a bookmark', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Delete a bookmark', async () => {
        const bookmark = await testUtils.agent.delete('/bookmarks/bookmark-5').query({ apiKey: '987654321' });

        const checkForBookmark = await client.prisma.bookmark.findFirst({
            where: {
                type: 'TOPIC',
                entityId: 'test-topic-1a',
                userId: '987654321'
            }
        });

        expect(bookmark.status).toEqual(200);
        expect(checkForBookmark).toEqual(null);
    });

    test('Cannot delete a bookmark as an un-authenticated user', async () => {
        const bookmark = await testUtils.agent.delete('/bookmarks/bookmark-4').query({ apiKey: null });

        expect(bookmark.status).toEqual(401);
    });

    test('Cannot delete a bookmark that does not exist', async () => {
        const bookmark = await testUtils.agent.delete('/bookmarks/made-up-bookmark').query({ apiKey: '123456789' });

        expect(bookmark.status).toEqual(404);
    });
});
