import * as testUtils from 'lib/testUtils';

beforeEach(async () => {
    await testUtils.clearDB();
    await testUtils.testSeed();
});

describe('Update publication version status', () => {
    test('User with permissions can update their publication version to LIVE from DRAFT (after creating a link)', async () => {
        const updatePublicationVersionAttemptOne = await testUtils.agent
            .put('/publication-versions/publication-analysis-draft-v1/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatePublicationVersionAttemptOne.status).toEqual(403);

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

        const updatePublicationVersionAttemptTwo = await testUtils.agent
            .put('/publication-versions/publication-analysis-draft-v1/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatePublicationVersionAttemptTwo.status).toEqual(200);
    });

    test('User with permissions can update their publication version to LIVE from DRAFT', async () => {
        const updatePublicationVersion = await testUtils.agent
            .put('/publication-versions/publication-hypothesis-draft-problem-live-v1/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatePublicationVersion.status).toEqual(200);
    });

    test('User with permissions cannot update their publication to DRAFT from LIVE', async () => {
        const updatePublicationVersion = await testUtils.agent
            .put('/publication-versions/publication-problem-live-v1/status/DRAFT')
            .query({
                apiKey: '123456789'
            });

        expect(updatePublicationVersion.status).toEqual(403);
    });

    test('User without permissions cannot update their publication to LIVE from DRAFT', async () => {
        const updatePublicationVersion = await testUtils.agent
            .put('/publication-versions/publication-hypothesis-draft-problem-live-v1/status/LIVE')
            .query({
                apiKey: '987654321'
            });

        expect(updatePublicationVersion.status).toEqual(403);
    });

    test('User with permissions cannot update their publication to LIVE from DRAFT if there is no content.', async () => {
        const updatePublicationVersion = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-no-content-v1/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatePublicationVersion.status).toEqual(403);
    });

    test('User with permissions cannot update their publication to LIVE from DRAFT if there is no licence.', async () => {
        const updatePublicationVersion = await testUtils.agent
            .put('/publication-versions/publication-hypothesis-draft-v1/status/LIVE')
            .query({
                apiKey: '000000005'
            });

        expect(updatePublicationVersion.status).toEqual(403);
    });

    test('User with permissions can update their publication version to LIVE from DRAFT and a publishedDate is created', async () => {
        const updatePublicationVersion = await testUtils.agent
            .put('/publication-versions/publication-hypothesis-draft-problem-live-v1/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatePublicationVersion.status).toEqual(200);
        expect(updatePublicationVersion.body.message).toEqual('Publication is now LIVE.');
    });

    // COI tests
    test('User with permissions cannot update their publication to LIVE if they have a conflict of interest, but have not provided coi text', async () => {
        const updatePublicationVersion = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-with-coi-but-no-text-v1/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatePublicationVersion.status).toEqual(403);
    });

    test('User with permissions can update their publication version to LIVE with a conflict of interest, if they have provided text', async () => {
        const updatePublicationVersion = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-with-coi-with-text-v1/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatePublicationVersion.status).toEqual(200);
    });

    test('User with permissions can update their publication version to LIVE if they have no conflict of interest & have not provided text', async () => {
        const updatePublicationVersion = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-with-no-coi-with-no-text-v1/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatePublicationVersion.status).toEqual(200);
    });

    test('User with permissions can update their publication version to LIVE if they have no conflict of interest & have provided text', async () => {
        const updatePublicationVersion = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-with-no-coi-with-text-v1/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatePublicationVersion.status).toEqual(200);
    });

    test('Publication owner can publish if all co-authors are confirmed', async () => {
        const updatePublicationVersion = await testUtils.agent
            .put('/publication-versions/publication-protocol-draft-v1/status/LIVE')
            .query({
                apiKey: '000000005'
            });

        expect(updatePublicationVersion.status).toEqual(200);

        expect(updatePublicationVersion.body.message).toEqual('Publication is now LIVE.');
    });

    test('Publication owner cannot publish if not all co-authors are confirmed', async () => {
        const updatePublicationVersion = await testUtils.agent
            .put('/publication-versions/publication-hypothesis-draft-v1/status/LIVE')
            .query({
                apiKey: '000000005'
            });

        expect(updatePublicationVersion.status).toEqual(403);
        expect(updatePublicationVersion.body.message).toEqual(
            'Publication is not ready to be made LIVE. Make sure all fields are filled in.'
        );

        const getPublicationVersion = await testUtils.agent
            .get('/publications/publication-hypothesis-draft/publication-versions/latest')
            .query({
                apiKey: '000000005'
            });

        expect(getPublicationVersion.body.currentStatus).toEqual('DRAFT');
    });

    test('User other than the owner (does not have permission) cannot publish if co-authors all approved', async () => {
        const updatePublicationVersion = await testUtils.agent
            .put('/publication-versions/publication-hypothesis-draft-v1/status/LIVE')
            .query({
                apiKey: '000000006'
            });

        expect(updatePublicationVersion.status).toEqual(403);
        expect(updatePublicationVersion.body.message).toEqual(
            'You do not have permission to modify the status of this publication.'
        );

        const getPublicationVersion = await testUtils.agent
            .get('/publications/publication-hypothesis-draft/publication-versions/latest')
            .query({
                apiKey: '000000005'
            });

        expect(getPublicationVersion.body.currentStatus).toEqual('DRAFT');
    });

    test('Publication owner cannot update publication status to LOCKED if there are no co-authors', async () => {
        const response = await testUtils.agent.put('/publication-versions/publication-2-v1/status/LOCKED').query({
            apiKey: '987654321'
        });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual(
            'Publication is not ready to be LOCKED. Make sure all fields are filled in.'
        );
    });

    test('Throws an error if trying to update publication status to the same status', async () => {
        const response = await testUtils.agent.put('/publication-versions/publication-2-v1/status/DRAFT').query({
            apiKey: '987654321'
        });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual('Publication status is already DRAFT.');
    });

    test('Publication status can be updated from DRAFT to LOCKED only after requesting approvals', async () => {
        // try to update status to LOCKED
        const updateStatusResponse1 = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/status/LOCKED')
            .query({
                apiKey: '000000005'
            });

        expect(updateStatusResponse1.status).toEqual(403);
        expect(updateStatusResponse1.body.message).toEqual(
            'Publication is not ready to be LOCKED. Make sure all fields are filled in.'
        );

        // request co-authors approvals
        const requestApprovalsResponse = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors/request-approval')
            .query({
                apiKey: '000000005'
            });

        expect(requestApprovalsResponse.status).toEqual(200);

        // try to update status to LOCKED again
        const updateStatusResponse2 = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/status/LOCKED')
            .query({
                apiKey: '000000005'
            });

        expect(updateStatusResponse2.status).toEqual(200);
        expect(updateStatusResponse2.body.message).toEqual('Publication status updated to LOCKED.');
    });

    test('Publication status can be updated from LOCKED to LIVE after all co-authors approved', async () => {
        const response = await testUtils.agent
            .put('/publication-versions/locked-publication-problem-confirmed-co-authors-v1/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('Publication is now LIVE.');
    });

    test('User can publish a new version for an existing publication', async () => {
        // seed OpenSearch records first
        await testUtils.openSearchSeed();

        // create a new version
        const newPublicationVersion = await testUtils.agent
            .post('/publications/publication-problem-live-2/publication-versions')
            .query({
                apiKey: '123456789'
            });

        expect(newPublicationVersion.status).toEqual(201);
        expect(newPublicationVersion.body.currentStatus).toEqual('DRAFT');
        expect(newPublicationVersion.body.doi).toEqual(null); // DOI is only generated when the new version goes LIVE

        // publish the newest created version
        const publishNewVersion = await testUtils.agent
            .put(`/publication-versions/${newPublicationVersion.body.id}/status/LIVE`)
            .query({
                apiKey: '123456789'
            });

        expect(publishNewVersion.status).toEqual(200);
        expect(publishNewVersion.body.message).toEqual('Publication is now LIVE.');

        const newestPublishedVersion = await testUtils.agent.get(
            '/publications/publication-problem-live-2/publication-versions/latest'
        );

        expect(newestPublishedVersion.status).toEqual(200);
        expect(newestPublishedVersion.body.currentStatus).toEqual('LIVE');
        expect(newestPublishedVersion.body.doi).not.toEqual(null); // the new version now has a DOI generated
        expect(typeof newestPublishedVersion.body.doi).toBe('string');
        expect(newestPublishedVersion.body.versionNumber).toEqual(2); // version 2 published
        expect(newestPublishedVersion.body.isLatestLiveVersion).toBe(true);
    });
});
