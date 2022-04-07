import * as testUtils from 'lib/testUtils';

const publication = {
    user1Draft: 'publication-problem-draft',
    user1Live: 'publication-problem-live'
};

describe('Deny user as a co-author', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('Deny user as a co-author', async () => {
        const denyCoAuthor = await testUtils.agent
            .delete(`/confirm-co-authorship/${publication.user1Draft}`)
            .query({ apiKey: '987654321', email: 'testemail@test.com', code: 'test' });

        expect(denyCoAuthor.status).toEqual(200);
        expect(denyCoAuthor?.body.CoauthorsDenied).toEqual(1);
    });

    test('Cannot deny co-author on a publication that does not exist', async () => {
        const denyCoAuthor = await testUtils.agent
            .patch(`/confirm-co-authorship/non-existent-publication`)
            .query({ apiKey: '987654321', email: 'testemail@test.com', code: 'test' });

        expect(denyCoAuthor.status).toEqual(404);
    });
});
