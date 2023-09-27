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
            .send(['test-topic-1']);

        expect(updateTopicsRequest.status).toEqual(200);
    });

    test('Cannot update topics when publication type is not problem', async () => {
        const updateTopicsRequest = await testUtils.agent
            .put('/publications/publication-hypothesis-draft/topics')
            .query({ apiKey: '000000005' })
            .send(['test-topic-1']);

        expect(updateTopicsRequest.status).toEqual(400);
        expect(updateTopicsRequest.body.message).toEqual(
            'You can not supply topics for a publication that is not a problem.'
        );
    });

    test('Cannot update topics when there is no active draft', async () => {
        const updateTopicsRequest = await testUtils.agent
            .put('/publications/publication-problem-live/topics')
            .query({ apiKey: '123456789' })
            .send(['test-topic-1']);

        expect(updateTopicsRequest.status).toEqual(400);
        expect(updateTopicsRequest.body.message).toEqual(
            'You can not change topics while the publication has no active draft version.'
        );
    });

    test('Cannot update topics for invalid publication id', async () => {
        const updateTopicsRequest = await testUtils.agent
            .put('/publications/made-up-publication-id/topics')
            .query({ apiKey: '123456789' })
            .send(['test-topic-1']);

        expect(updateTopicsRequest.status).toEqual(404);
        expect(updateTopicsRequest.body.message).toEqual('This publication does not exist.');
    });

    test('Cannot update publication with invalid topic id', async () => {
        const updateTopicsRequest = await testUtils.agent
            .put('/publications/publication-problem-draft/topics')
            .query({ apiKey: '000000005' })
            .send(['made-up-topic-id']);

        expect(updateTopicsRequest.status).toEqual(500);
    });

    test('Cannot update publication topics without permission', async () => {
        const updateTopicsRequest = await testUtils.agent
            .put('/publications/publication-problem-draft/topics')
            .query({ apiKey: '987654321' })
            .send(['test-topic-1']);

        expect(updateTopicsRequest.status).toEqual(403);
        expect(updateTopicsRequest.body.message).toEqual(
            'You do not have permission to update topics for this publication.'
        );
    });

    test('Cannot remove existing topic where it would leave no topic or linked publication', async () => {
        const updateTopicsRequest = await testUtils.agent
            .put('/publications/publication-problem-draft-with-topic/topics')
            .query({ apiKey: '000000010' })
            .send([]);

        expect(updateTopicsRequest.status).toEqual(400);
        expect(updateTopicsRequest.body.message).toEqual(
            'A publication can not be left without topics or linked publications.'
        );
    });
});
