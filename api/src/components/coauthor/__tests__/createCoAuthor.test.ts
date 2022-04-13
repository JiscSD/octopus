import * as testUtils from 'lib/testUtils';

describe('create coauthor', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('Create a co-author', async () => {
        const coauthor = await testUtils.agent
            .post(`/publications/publication-problem-draft/coauthor`)
            .query({ apiKey: '123456789' })
            .send({
                email: 'emailtest@emailtest.com'
            });

        expect(coauthor.status).toEqual(201);
    });

    test('Cannot create a co-author without a valid email', async () => {
        const coauthor = await testUtils.agent
            .post(`/publications/publication-problem-draft/coauthor`)
            .query({ apiKey: '123456789' })
            .send({
                email: 'test'
            });

        expect(coauthor.status).toEqual(422);
    });

    test('Cannot create a co-author record if the user is not the author of a publication', async () => {
        const coauthor = await testUtils.agent
            .post(`/publications/publication-problem-draft/coauthor`)
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
            .post(`/publications/publication-problem-live/coauthor`)
            .query({ apiKey: '123456789' })
            .send({
                email: 'emailtest@emailtest.com'
            });

        expect(coauthor.status).toEqual(403);
    });

    test('Cannot create a co-author record when a record is already there for email & publicationId', async () => {
        const coauthor = await testUtils.agent
            .post(`/publications/publication-problem-draft/coauthor`)
            .query({ apiKey: '123456789' })
            .send({
                email: 'testemail@test.com'
            });

        expect(coauthor.status).toEqual(409);
    });
});
