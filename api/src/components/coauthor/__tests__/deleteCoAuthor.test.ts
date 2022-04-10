import * as testUtils from 'lib/testUtils';

describe('Delete co-author', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('Delete a co-author', async () => {
        const deleteCoAuthor = await testUtils.agent
            .delete(`/publications/publication-problem-draft/coauthor/testCoAuthor`)
            .query({ apiKey: '123456789' });

        expect(deleteCoAuthor.status).toEqual(200);
    });

    test('Cannot Delete a co-author without a valid id/coauthor has not been added to this publication', async () => {
        const deleteCoAuthor = await testUtils.agent
            .delete(`/publications/publication-problem-draft/coauthor/invalid-id`)
            .query({ apiKey: '123456789' });

        expect(deleteCoAuthor.status).toEqual(404);
    });

    test('Cannot Delete a co-author record if the user is not the author of a publication', async () => {
        const deleteCoAuthor = await testUtils.agent
            .delete(`/publications/publication-problem-draft/coauthor/testCoAuthor`)
            .query({ apiKey: '987654321' });

        expect(deleteCoAuthor.status).toEqual(403);
    });

    test('Cannot Delete a co-author record if the publication is live', async () => {
        const deleteCoAuthor = await testUtils.agent
            .delete(`/publications/publication-problem-draft/coauthor/testCoAuthorLive`)
            .query({ apiKey: '123456789' });

        expect(deleteCoAuthor.status).toEqual(404);
    });

    test('Cannot Delete a co-author record on a publication that does not exist', async () => {
        const deleteCoAuthor = await testUtils.agent
            .delete(`/publications/non-existent-publication/coauthor/testCoAuthor`)
            .query({ apiKey: '123456789' });

        expect(deleteCoAuthor.status).toEqual(404);
    });
});
