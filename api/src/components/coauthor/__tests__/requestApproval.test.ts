import * as testUtils from 'lib/testUtils';

describe('Request co-authors approvals', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Can request approvals only if the publication version is DRAFT or LOCKED', async () => {
        const draftPublicationVersionResponse = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors/request-approval')
            .query({ apiKey: '000000005' });

        expect(draftPublicationVersionResponse.status).toEqual(200);

        const lockedPublicationVersionResponse = await testUtils.agent
            .put('/publication-versions/publication-problem-locked-1-v1/coauthors/request-approval')
            .query({ apiKey: '000000005' });

        expect(lockedPublicationVersionResponse.status).toEqual(200);
    });

    test('Cannot request approvals for a LIVE publication version', async () => {
        const livePublicationVersionResponse = await testUtils.agent
            .put('/publication-versions/publication-problem-live-v1/coauthors/request-approval')
            .query({ apiKey: '123456789' });

        expect(livePublicationVersionResponse.status).toEqual(400);
    });

    test('Cannot request approvals if user is not the creator', async () => {
        const draftPublicationVersionResponse = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors/request-approval')
            .query({ apiKey: '000000006' });

        expect(draftPublicationVersionResponse.status).toEqual(403);
    });

    test('Cannot request approvals if publication has no-coauthors', async () => {
        const draftPublicationVersionResponse = await testUtils.agent
            .put('/publication-versions/publication-2-v1/coauthors/request-approval')
            .query({ apiKey: '987654321' });

        expect(draftPublicationVersionResponse.status).toEqual(403);
    });
});
