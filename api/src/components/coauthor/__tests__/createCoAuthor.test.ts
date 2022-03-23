import * as testUtils from 'lib/testUtils';

describe('create coauthor', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    const publication = {
        'user1-draft': 'publication-problem-draft',
        'user1-live': 'publication-problem-live',
        'user2-draft': 'publication-2'
    };

    test('Create a co-author', async () => {
        const coauthor = await testUtils.agent
            .post(`/publications/${publication[1]}/coauthor`)
            .query({ apiKey: '123456789' })
            .send({
                email: 'emailtest@emailtest.com'
            });

        expect(coauthor.status).toEqual(200);
    });

    test.skip('Cannot create a co-author record if the user is not the author of a publication', async () => {
        const coauthor = await testUtils.agent
            .post(`/publications/${publication[1]}/coauthor`)
            .query({ apiKey: '123456789' })
            .send({
                email: 'emailtest@emailtest.com'
            });

        expect(coauthor.status).toEqual(200);
    });

    test.skip('Cannot create a co-author record on a publication that does not exist', async () => {
        const coauthor = await testUtils.agent
            .post(`/publications/${publication[1]}/coauthor`)
            .query({ apiKey: '123456789' })
            .send({
                email: 'emailtest@emailtest.com'
            });

        expect(coauthor.status).toEqual(200);
    });

    test.skip('Cannot create a co-author record on a publication that is live', async () => {
        const coauthor = await testUtils.agent
            .post(`/publications/${publication[1]}/coauthor`)
            .query({ apiKey: '123456789' })
            .send({
                email: 'emailtest@emailtest.com'
            });

        expect(coauthor.status).toEqual(200);
    });

    test.skip('Cannot create a co-author record when a record is already there for email&publicationId', async () => {
        const coauthor = await testUtils.agent
            .post(`/publications/${publication[1]}/coauthor`)
            .query({ apiKey: '123456789' })
            .send({
                email: 'emailtest@emailtest.com'
            });

        expect(coauthor.status).toEqual(200);
    });
});
