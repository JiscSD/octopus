import * as testUtils from 'lib/testUtils';

const publication = {
    user1Draft: 'publication-problem-draft',
    user1Live: 'publication-problem-live'
};

describe('Confirm that user is a co-author', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('Confirm that user is a co-author', async () => {
        const confirmCoAuthor = await testUtils.agent
            .patch(`/confirm-co-authorship/${publication.user1Draft}`)
            .query({ apiKey: '987654321', email: 'testemail@test.com', code: 'test' });

        expect(confirmCoAuthor.status).toEqual(200);
        expect(confirmCoAuthor?.body.CoauthorsConfirmed).toEqual(1);
    });

    test('Cannot Resend new code for co-author on a publication that does not exist', async () => {
        const confirmCoAuthor = await testUtils.agent
            .patch(`/confirm-co-authorship/non-existent-publication`)
            .query({ apiKey: '987654321', email: 'testemail@test.com', code: 'test' });

        expect(confirmCoAuthor.status).toEqual(404);
    });
});
