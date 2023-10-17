import * as testUtils from 'lib/testUtils';

describe('Delete co-author', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Delete a co-author', async () => {
        const deleteCoAuthor = await testUtils.agent
            .delete('/publication-versions/publication-problem-draft-v1/coauthors/coauthor-test-user-6-problem-draft')
            .query({ apiKey: '000000005' });

        expect(deleteCoAuthor.status).toEqual(200);
    });

    test('Cannot Delete a co-author without a valid id/coauthor has not been added to this publication version', async () => {
        const deleteCoAuthor = await testUtils.agent
            .delete('/publication-versions/publication-problem-draft-v1/coauthors/invalid-id')
            .query({ apiKey: '000000005' });

        expect(deleteCoAuthor.status).toEqual(404);
    });

    test('Cannot Delete a co-author record if the user is not the author of a publication version', async () => {
        const deleteCoAuthor = await testUtils.agent
            .delete('/publication-versions/publication-problem-draft-v1/coauthors/coauthor-test-user-5-problem-draft')
            .query({ apiKey: '987654321' });

        expect(deleteCoAuthor.status).toEqual(403);
    });

    test('Cannot Delete a co-author record if the publication version is live', async () => {
        const deleteCoAuthor = await testUtils.agent
            .delete('/publication-versions/publication-problem-draft-v1/coauthors/co-author-test-user-6-problem-live')
            .query({ apiKey: '000000005' });

        expect(deleteCoAuthor.status).toEqual(404);
    });

    test('Cannot Delete a co-author record on a publication version that does not exist', async () => {
        const deleteCoAuthor = await testUtils.agent
            .delete('/publication-versions/non-existent-publication-v1/coauthors/coauthor-test-user-5-problem-draft')
            .query({ apiKey: '123456789' });

        expect(deleteCoAuthor.status).toEqual(404);
    });
});
