import * as testUtils from 'lib/testUtils';

describe('Request co-authors approvals', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Can request approvals only if the publication is LOCKED', async () => {
        const draftPublicationResponse = await testUtils.agent
            .put('/publications/publication-problem-draft/coauthors/request-approval')
            .query({ apiKey: '000000005' });

        expect(draftPublicationResponse.status).toEqual(403);

        const lockedPublicationResponse = await testUtils.agent
            .put('/publications/publication-problem-locked/coauthors/request-approval')
            .query({ apiKey: '000000005' });

        expect(lockedPublicationResponse.status).toEqual(200);
    });

    test('Cannot request approvals for a LIVE publication', async () => {
        const livePublicationResponse = await testUtils.agent
            .put('/publications/publication-problem-live/coauthors/request-approval')
            .query({ apiKey: '123456789' });

        expect(livePublicationResponse.status).toEqual(403);
    });

    test('Cannot request approvals if user is not the creator', async () => {
        const draftPublicationResponse = await testUtils.agent
            .put('/publications/publication-problem-draft/coauthors/request-approval')
            .query({ apiKey: '000000006' });

        expect(draftPublicationResponse.status).toEqual(403);
    });

    test('Cannot request approvals if publication has no-coauthors', async () => {
        const draftPublicationResponse = await testUtils.agent
            .put('/publications/publication-2/coauthors/request-approval')
            .query({ apiKey: '987654321' });

        expect(draftPublicationResponse.status).toEqual(403);
    });
});
