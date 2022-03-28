import * as testUtils from 'lib/testUtils';

const publication = {
    user1Draft: 'publication-problem-draft',
    user1Live: 'publication-problem-live'
};

describe('Resend new code for co-author', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('Resend new code for co-author', async () => {
        const resendCoAuthor = await testUtils.agent
            .patch(`/publications/${publication.user1Draft}/coauthor/testCoAuthor`)
            .query({ apiKey: '123456789' });

        expect(resendCoAuthor.status).toEqual(200);
    });

    test('Cannot Resend new code for co-author without a valid id/coauthor has not been added to this publication', async () => {
        const resendCoAuthor = await testUtils.agent
            .patch(`/publications/${publication.user1Draft}/coauthor/invalid-id`)
            .query({ apiKey: '123456789' });

        expect(resendCoAuthor.status).toEqual(404);
    });

    test('Cannot Resend new code for co-author if the user is not the author of a publication', async () => {
        const resendCoAuthor = await testUtils.agent
            .patch(`/publications/${publication.user1Draft}/coauthor/testCoAuthor`)
            .query({ apiKey: '987654321' });

        expect(resendCoAuthor.status).toEqual(403);
    });

    test('Cannot Resend new code for co-author on a publication that does not exist', async () => {
        const resendCoAuthor = await testUtils.agent
            .patch(`/publications/non-existent-publication/coauthor/testCoAuthor`)
            .query({ apiKey: '123456789' });

        expect(resendCoAuthor.status).toEqual(404);
    });
});
