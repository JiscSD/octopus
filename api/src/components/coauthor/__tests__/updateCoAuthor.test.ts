import * as testUtils from 'lib/testUtils';

const publication = {
    user1Draft: 'publication-problem-draft',
    user1Live: 'publication-problem-live'
};

// todo

describe.skip('Change user response as a co-author', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('Change user response as a co-author', async () => {
        const resendCoAuthor = await testUtils.agent
            .patch(`/confirm-co-authorship/${publication.user1Draft}/test-user-2`)
            .query({ apiKey: '123456789' });

        expect(resendCoAuthor.status).toEqual(200);
    });

    test('Cannot change user repsonse as a co-author on a publication that does not exist', async () => {
        const resendCoAuthor = await testUtils.agent
            .patch(`/confirm-co-authorship/non-existent-publication/test-user-2`)
            .query({ apiKey: '123456789' });

        expect(resendCoAuthor.status).toEqual(404);
    });
});
