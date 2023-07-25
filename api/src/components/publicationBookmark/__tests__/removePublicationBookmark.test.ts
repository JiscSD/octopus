import * as testUtils from 'lib/testUtils';
import * as client from 'lib/client';

describe('Remove a publication bookmark', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Delete a publication bookmark', async () => {
        const bookmark = await testUtils.agent
            .delete('/publications/publication-problem-live/bookmark')
            .query({ apiKey: '987654321' });

        const checkForBookmark = await client.prisma.publicationBookmarks.findFirst({
            where: {
                publicationId: 'publication-problem-live',
                userId: '987654321'
            }
        });

        expect(bookmark.status).toEqual(200);
        expect(checkForBookmark).toEqual(null);
    });

    test('Cannot delete a publication bookmark as an un-authenticated user', async () => {
        const bookmark = await testUtils.agent
            .delete('/publications/publication-problem-live/bookmark')
            .query({ apiKey: null });

        expect(bookmark.status).toEqual(401);
    });

    test('Cannot delete a publication bookmark that another user has created', async () => {
        const bookmark = await testUtils.agent
            .delete('/publications/publication-problem-live/bookmark')
            .query({ apiKey: null });

        expect(bookmark.status).toEqual(401);
    });

    test('Cannot delete a publication bookmark that does not exist', async () => {
        const bookmark = await testUtils.agent
            .delete('/publications/publication-hypothesis-live/bookmark')
            .query({ apiKey: '987654321' });

        expect(bookmark.status).toEqual(404);
    });
});
