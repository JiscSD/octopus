import * as testUtils from 'lib/testUtils';

beforeEach(async () => {
    await testUtils.clearDB();
    await testUtils.testSeed();
});

describe('Update publication status', () => {
    test('User with permissions can update their publication to LIVE from DRAFT (after creating a link)', async () => {
        const updatePublicationAttemptOne = await testUtils.agent
            .put('/publications/publication-analysis-draft/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatePublicationAttemptOne.status).toEqual(403);

        // add a valid link
        await testUtils.agent
            .post('/links')
            .query({
                apiKey: '123456789'
            })
            .send({
                from: 'publication-analysis-draft',
                to: 'publication-data-live'
            });

        const updatePublicationAttemptTwo = await testUtils.agent
            .put('/publications/publication-analysis-draft/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatePublicationAttemptTwo.status).toEqual(200);
    });

    test('User with permissions can update their publication to LIVE from DRAFT', async () => {
        const updatedPublication = await testUtils.agent
            .put('/publications/publication-hypothesis-draft-problem-live/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatedPublication.status).toEqual(200);
    });

    test('User with permissions cannot update their publication to DRAFT from LIVE', async () => {
        const updatedPublication = await testUtils.agent
            .put('/publications/publication-problem-live/status/DRAFT')
            .query({
                apiKey: '123456789'
            });

        expect(updatedPublication.status).toEqual(403);
    });

    test('User without permissions cannot update their publication to LIVE from DRAFT', async () => {
        const updatedPublication = await testUtils.agent
            .put('/publications/publication-hypothesis-draft-problem-live/status/LIVE')
            .query({
                apiKey: '987654321'
            });

        expect(updatedPublication.status).toEqual(403);
    });

    test('User with permissions cannot update their publication to LIVE from DRAFT if there is no content.', async () => {
        const updatedPublication = await testUtils.agent
            .put('/publications/publication-problem-draft-no-content/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatedPublication.status).toEqual(403);
    });

    test('User with permissions cannot update their publication to LIVE from DRAFT if there is no licence.', async () => {
        const updatedPublication = await testUtils.agent
            .put('/publications/publication-hypothesis-draft/status/LIVE')
            .query({
                apiKey: '000000005'
            });

        expect(updatedPublication.status).toEqual(403);
    });

    test('User with permissions can update their publication to LIVE from DRAFT and a publishedDate is created', async () => {
        const updatedPublication = await testUtils.agent
            .put('/publications/publication-hypothesis-draft-problem-live/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatedPublication.status).toEqual(200);
        expect(updatedPublication.body.message).toEqual('Publication is now LIVE.');
    });

    // COI tests
    test('User with permissions cannot update their publication to LIVE if they have a conflict of interest, but have not provided coi text', async () => {
        const updatedPublication = await testUtils.agent
            .put('/publications/publication-problem-draft-with-coi-but-no-text/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatedPublication.status).toEqual(403);
    });

    test('User with permissions can update their publication to LIVE with a conflict of interest, if they have provided text', async () => {
        const updatedPublication = await testUtils.agent
            .put('/publications/publication-problem-draft-with-coi-with-text/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatedPublication.status).toEqual(200);
    });

    test('User with permissions can update their publication to LIVE if they have no conflict of interest & have not provided text', async () => {
        const updatedPublication = await testUtils.agent
            .put('/publications/publication-problem-draft-with-no-coi-with-no-text/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatedPublication.status).toEqual(200);
    });

    test('User with permissions can update their publication to LIVE if they have no conflict of interest & have provided text', async () => {
        const updatedPublication = await testUtils.agent
            .put('/publications/publication-problem-draft-with-no-coi-with-text/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatedPublication.status).toEqual(200);
    });

    test('Publication owner can publish if all co-authors are confirmed', async () => {
        const updatePublication = await testUtils.agent
            .put('/publications/publication-protocol-draft/status/LIVE')
            .query({
                apiKey: '000000005'
            });

        expect(updatePublication.status).toEqual(200);

        expect(updatePublication.body.message).toEqual('Publication is now LIVE.');
    });

    test('Publication owner cannot publish if not all co-authors are confirmed', async () => {
        const updatePublication = await testUtils.agent
            .put('/publications/publication-hypothesis-draft/status/LIVE')
            .query({
                apiKey: '000000005'
            });

        expect(updatePublication.status).toEqual(403);
        expect(updatePublication.body.message).toEqual(
            'Publication is not ready to be made LIVE. Make sure all fields are filled in.'
        );

        const getPublicationStatus = await testUtils.agent.get('/publications/publication-hypothesis-draft').query({
            apiKey: '000000005'
        });

        expect(getPublicationStatus.body.currentStatus).toEqual('DRAFT');
    });

    test('User other than the owner (does not have permission) cannot publish if co-authors all approved', async () => {
        const updatePublication = await testUtils.agent
            .put('/publications/publication-hypothesis-draft/status/LIVE')
            .query({
                apiKey: '000000006'
            });

        expect(updatePublication.status).toEqual(403);
        expect(updatePublication.body.message).toEqual(
            'You do not have permission to modify the status of this publication.'
        );

        const getPublicationStatus = await testUtils.agent.get('/publications/publication-hypothesis-draft').query({
            apiKey: '000000005'
        });

        expect(getPublicationStatus.body.currentStatus).toEqual('DRAFT');
    });

    test('Publication owner cannot update publication status to LOCKED if there are no co-authors', async () => {
        const response = await testUtils.agent.put('/publications/publication-2/status/LOCKED').query({
            apiKey: '987654321'
        });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual(
            'Publication is not ready to be LOCKED. Make sure all fields are filled in.'
        );
    });

    test('Throws an error if trying to update publication status to the same status', async () => {
        const response = await testUtils.agent.put('/publications/publication-2/status/DRAFT').query({
            apiKey: '987654321'
        });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual('Publication status is already DRAFT.');
    });

    test('Publication status can be updated from DRAFT to LOCKED only after requesting approvals', async () => {
        // try to update status to LOCKED
        const updateStatusResponse1 = await testUtils.agent
            .put('/publications/publication-problem-draft/status/LOCKED')
            .query({
                apiKey: '000000005'
            });

        expect(updateStatusResponse1.status).toEqual(403);
        expect(updateStatusResponse1.body.message).toEqual(
            'Publication is not ready to be LOCKED. Make sure all fields are filled in.'
        );

        // request co-authors approvals
        const requestApprovalsResponse = await testUtils.agent
            .put('/publicationVersions/publication-problem-draft-v1/coauthors/request-approval')
            .query({
                apiKey: '000000005'
            });

        expect(requestApprovalsResponse.status).toEqual(200);

        // try to update status to LOCKED again
        const updateStatusResponse2 = await testUtils.agent
            .put('/publications/publication-problem-draft/status/LOCKED')
            .query({
                apiKey: '000000005'
            });

        expect(updateStatusResponse2.status).toEqual(200);
        expect(updateStatusResponse2.body.message).toEqual('Publication status updated to LOCKED.');
    });

    test('Publication status can be updated from LOCKED to LIVE after all co-authors approved', async () => {
        const response = await testUtils.agent
            .put('/publications/locked-publication-problem-confirmed-co-authors/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('Publication is now LIVE.');
    });
});
