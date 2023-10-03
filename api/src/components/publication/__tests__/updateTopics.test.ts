import * as testUtils from 'lib/testUtils';

beforeEach(async () => {
    await testUtils.clearDB();
    await testUtils.testSeed();
});

describe('Update publication topics', () => {
    test('Can update publication topics', async () => {
        const updateTopicsRequest = await testUtils.agent
            .put('/publications/publication-problem-draft/topics')
            .query({ apiKey: '000000005' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(200);
        expect(updateTopicsRequest.body.length).toEqual(1);
        expect(updateTopicsRequest.body[0]).toMatchObject({
            id: 'test-topic-1',
            title: 'Test topic'
        });
    });

    test('Cannot update topics when publication type is not problem', async () => {
        const updateTopicsRequest = await testUtils.agent
            .put('/publications/publication-hypothesis-draft/topics')
            .query({ apiKey: '000000005' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(400);
        expect(updateTopicsRequest.body.message).toEqual(
            'You can not supply topics for a publication that is not a problem.'
        );
    });

    test('Cannot update topics when there is no active draft', async () => {
        const updateTopicsRequest = await testUtils.agent
            .put('/publications/publication-problem-live/topics')
            .query({ apiKey: '123456789' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(400);
        expect(updateTopicsRequest.body.message).toEqual(
            'You can not change topics while the publication has no active draft version.'
        );
    });

    test('Cannot update topics for invalid publication id', async () => {
        const updateTopicsRequest = await testUtils.agent
            .put('/publications/made-up-publication-id/topics')
            .query({ apiKey: '123456789' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(404);
        expect(updateTopicsRequest.body.message).toEqual('This publication does not exist.');
    });

    test('Cannot update publication with invalid topic id', async () => {
        const updateTopicsRequest = await testUtils.agent
            .put('/publications/publication-problem-draft/topics')
            .query({ apiKey: '000000005' })
            .send({ topics: ['made-up-topic-id'] });

        expect(updateTopicsRequest.status).toEqual(500);
    });

    test('Cannot update publication topics without permission', async () => {
        const updateTopicsRequest = await testUtils.agent
            .put('/publications/publication-problem-draft/topics')
            .query({ apiKey: '987654321' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(403);
        expect(updateTopicsRequest.body.message).toEqual(
            'You do not have permission to update topics for this publication.'
        );
    });
});
