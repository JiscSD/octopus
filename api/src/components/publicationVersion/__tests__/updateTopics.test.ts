import * as testUtils from 'lib/testUtils';

beforeEach(async () => {
    await testUtils.clearDB();
    await testUtils.testSeed();
});

describe('Update publication version topics', () => {
    test('Can update publication version topics', async () => {
        const updateTopicsRequest = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1')
            .query({ apiKey: '000000005' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(200);
        expect(updateTopicsRequest.body.topics.length).toEqual(1);
        expect(updateTopicsRequest.body.topics[0]).toMatchObject({
            id: 'test-topic-1',
            title: 'Test topic'
        });
    });

    test('Cannot update topics when publication type is not problem', async () => {
        const updateTopicsRequest = await testUtils.agent
            .patch('/publication-versions/publication-hypothesis-draft-v1')
            .query({ apiKey: '000000005' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(400);
        expect(updateTopicsRequest.body.message).toEqual(
            'You can not supply topics for a publication that is not a problem.'
        );
    });

    test('Cannot update topics when there is no active draft', async () => {
        const updateTopicsRequest = await testUtils.agent
            .patch('/publication-versions/publication-problem-live-v1')
            .query({ apiKey: '123456789' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(403);
        expect(updateTopicsRequest.body.message).toEqual(
            'A publication version that is not in DRAFT state cannot be updated.'
        );
    });

    test('Cannot update topics for invalid publication id', async () => {
        const updateTopicsRequest = await testUtils.agent
            .patch('/publication-versions/made-up-publication-id-v1')
            .query({ apiKey: '123456789' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(404);
        expect(updateTopicsRequest.body.message).toEqual('This publication version does not exist.');
    });

    test('Cannot update publication with invalid topic id', async () => {
        const updateTopicsRequest = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1')
            .query({ apiKey: '000000005' })
            .send({ topics: ['made-up-topic-id'] });

        expect(updateTopicsRequest.status).toEqual(500);
    });

    test('Cannot update publication version topics without permission', async () => {
        const updateTopicsRequest = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1')
            .query({ apiKey: '987654321' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(403);
        expect(updateTopicsRequest.body.message).toEqual(
            'You do not have permission to update topics for this publication version.'
        );
    });
});
