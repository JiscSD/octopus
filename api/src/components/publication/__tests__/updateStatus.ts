import * as testUtils from 'lib/testUtils';

beforeEach(async () => {
    await testUtils.clearDB();
    await testUtils.initialSeed();
});

describe('Update publication status', () => {

    test('User with permissions can update their publication to LIVE from DRAFT (after creating a link)', async () => {
        const updatePublicationAttemptOne = await testUtils.agent.put('/publications/publication-problem-draft/status/LIVE').query({
            apiKey: '123456789'
        });

        expect(updatePublicationAttemptOne.status).toEqual(404);

        // add a valid link
        await testUtils.agent.post('/links').query({
            apiKey: '123456789'
        })
        .send({
            from: 'publication-problem-draft',
            to: 'publication-problem-live'
        });


        const updatePublicationAttemptTwo = await testUtils.agent.put('/publications/publication-problem-draft/status/LIVE').query({
            apiKey: '123456789'
        });

        expect(updatePublicationAttemptTwo.status).toEqual(200);
    });

    test('User with permissions can update their publication to LIVE from DRAFT', async () => {
        const updatedPublication = await testUtils.agent.put('/publications/publication-hypothesis-draft-problem-live/status/LIVE').query({
            apiKey: '123456789'
        });

        expect(updatedPublication.status).toEqual(200);
    });


    test('User with permissions cannot update their publication to DRAFT from LIVE', async () => {
        const updatedPublication = await testUtils.agent.put('/publications/publication-problem-live/status/DRAFT').query({
            apiKey: '123456789'
        });

        expect(updatedPublication.status).toEqual(422);
    });

    test('User without permissions cannot update their publication to LIVE from DRAFT', async () => {
        const updatedPublication = await testUtils.agent.put('/publications/publication-hypothesis-draft-problem-live/status/LIVE').query({
            apiKey: '987654321'
        });

        expect(updatedPublication.status).toEqual(403);
    });

    test('User with permissions cannot update their publication to LIVE from DRAFT if there is no content.', async () => {
        const updatePublicationAttemptOne = await testUtils.agent.put('/publications/publication-problem-draft-no-content/status/LIVE').query({
            apiKey: '123456789'
        });

        expect(updatePublicationAttemptOne.status).toEqual(404);
    });
});