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
        const resendCoAuthor = await testUtils.agent
            .patch(`/confirm-co-authorship/${publication.user1Draft}`)
            .query({ apiKey: '123456789' });

        expect(resendCoAuthor.status).toEqual(200);
    });

    test('Cannot Resend new code for co-author on a publication that does not exist', async () => {
        const resendCoAuthor = await testUtils.agent
            .patch(`/confirm-co-authorship/non-existent-publication`)
            .query({ apiKey: '123456789' });

        expect(resendCoAuthor.status).toEqual(404);
    });
});
