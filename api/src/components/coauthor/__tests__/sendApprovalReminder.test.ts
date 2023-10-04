import * as testUtils from 'lib/testUtils';

describe('Request co-authors approvals', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Can send approval reminder only if publication version status is LOCKED', async () => {
        // test LIVE
        const livePublicationVersionResponse = await testUtils.agent
            .post('/versions/publication-problem-live-v1/coauthors/coauthor-test-user-6-problem-live/approval-reminder')
            .query({ apiKey: '123456789' });

        expect(livePublicationVersionResponse.status).toEqual(403);
        expect(livePublicationVersionResponse.body.message).toEqual(
            'A reminder is not able to be sent unless approval is being requested'
        );

        // test DRAFT
        const draftPublicationVersionResponse = await testUtils.agent
            .post(
                '/versions/publication-problem-draft-v1/coauthors/coauthor-test-user-7-problem-draft/approval-reminder'
            )
            .query({ apiKey: '000000005' });

        expect(draftPublicationVersionResponse.status).toEqual(403);
        expect(draftPublicationVersionResponse.body.message).toEqual(
            'A reminder is not able to be sent unless approval is being requested'
        );

        // test LOCKED
        const lockedPublicationVersionResponse = await testUtils.agent
            .post(
                '/versions/publication-problem-locked-v1/coauthors/coauthor-test-user-7-problem-locked/approval-reminder'
            )
            .query({ apiKey: '000000005' });

        expect(lockedPublicationVersionResponse.status).toEqual(200);
        expect(lockedPublicationVersionResponse.body.message).toEqual('Reminder sent to test-user-7@jisc.ac.uk');
    });

    test('Cannot send approval reminder if a co-author already approved', async () => {
        const response = await testUtils.agent
            .post(
                '/versions/locked-publication-problem-confirmed-co-authors-v1/coauthors/test-user-2/approval-reminder'
            )
            .query({ apiKey: '123456789' });

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('This author has already approved this publication version');
    });

    test('Cannot send approval reminder to a user which is not a co-author', async () => {
        const response = await testUtils.agent
            .post(
                '/versions/locked-publication-problem-confirmed-co-authors-v1/coauthors/test-user-22/approval-reminder'
            )
            .query({ apiKey: '123456789' });

        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual('This author does not exist on this publication version');
    });

    test('Cannot send approval reminder to the same co-author twice', async () => {
        const response1 = await testUtils.agent
            .post(
                '/versions/publication-problem-locked-v1/coauthors/coauthor-test-user-7-problem-locked/approval-reminder'
            )
            .query({ apiKey: '000000005' });

        expect(response1.status).toEqual(200);
        expect(response1.body.message).toEqual('Reminder sent to test-user-7@jisc.ac.uk');

        const response2 = await testUtils.agent
            .post(
                '/versions/publication-problem-locked-v1/coauthors/coauthor-test-user-7-problem-locked/approval-reminder'
            )
            .query({ apiKey: '000000005' });

        expect(response2.status).toEqual(400);
        expect(response2.body.message).toEqual('You have already sent a reminder to this author');
    });
});
