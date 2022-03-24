import * as testUtils from 'lib/testUtils';

const publication = {
    user1Draft: 'publication-problem-draft',
    user1Live: 'publication-problem-live'
};

describe('create coauthor', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('Create a co-author', async () => {
        const coauthor = await testUtils.agent
            .post(`/publications/${publication.user1Draft}/coauthor`)
            .query({ apiKey: '123456789' })
            .send({
                email: 'emailtest@emailtest.com'
            });

        expect(coauthor.status).toEqual(200);
    });

    test('Cannot create a co-author record if the user is not the author of a publication', async () => {
        const coauthor = await testUtils.agent
            .post(`/publications/${publication.user1Draft}/coauthor`)
            .query({ apiKey: '987654321' })
            .send({
                email: 'emailtest@emailtest.com'
            });

        expect(coauthor.status).toEqual(403);
    });

    test('Cannot create a co-author record on a publication that does not exist', async () => {
        const coauthor = await testUtils.agent
            .post(`/publications/non-existent-publication/coauthor`)
            .query({ apiKey: '123456789' })
            .send({
                email: 'emailtest@emailtest.com'
            });

        expect(coauthor.status).toEqual(404);
    });

    test('Cannot create a co-author record on a publication that is live', async () => {
        const coauthor = await testUtils.agent
            .post(`/publications/${publication.user1Live}/coauthor`)
            .query({ apiKey: '123456789' })
            .send({
                email: 'emailtest@emailtest.com'
            });

        expect(coauthor.status).toEqual(403);
    });

    test('Cannot create a co-author record when a record is already there for email&publicationId', async () => {
        const coauthor = await testUtils.agent
            .post(`/publications/${publication.user1Draft}/coauthor`)
            .query({ apiKey: '123456789' })
            .send({
                email: 'emailtest@emailtest.com'
            });

        expect(coauthor.status).toEqual(200);

        const duplicate = await testUtils.agent
            .post(`/publications/${publication.user1Draft}/coauthor`)
            .query({ apiKey: '123456789' })
            .send({
                email: 'emailtest@emailtest.com'
            });

        expect(duplicate.status).toEqual(409);
    });
});
