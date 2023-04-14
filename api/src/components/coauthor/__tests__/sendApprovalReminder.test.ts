import * as testUtils from 'lib/testUtils';

describe('Request co-authors approvals', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Can send approval reminder only if publication status is LOCKED', async () => {
        // test LIVE
        const livePublicationResponse = await testUtils.agent
            .post(
                '/publications/publication-problem-live/coauthors/coauthor-test-user-6-problem-live/approval-reminder'
            )
            .query({ apiKey: '123456789' });

        expect(livePublicationResponse.status).toEqual(403);
        expect(livePublicationResponse.body.message).toEqual(
            'A reminder is not able to be sent unless approval is being requested'
        );

        // test DRAFT
        const draftPublicationResponse = await testUtils.agent
            .post(
                '/publications/publication-problem-draft/coauthors/coauthor-test-user-7-problem-draft/approval-reminder'
            )
            .query({ apiKey: '000000005' });

        expect(draftPublicationResponse.status).toEqual(403);
        expect(draftPublicationResponse.body.message).toEqual(
            'A reminder is not able to be sent unless approval is being requested'
        );

        // test LOCKED
        const lockedPublicationResponse = await testUtils.agent
            .post(
                '/publications/publication-problem-locked/coauthors/coauthor-test-user-7-problem-locked/approval-reminder'
            )
            .query({ apiKey: '000000005' });

        expect(lockedPublicationResponse.status).toEqual(200);
        expect(lockedPublicationResponse.body.message).toEqual('Reminder sent to test-user-7@jisc.ac.uk');
    });

    test('Cannot send approval reminder if a co-author already approved', async () => {
        const response = await testUtils.agent
            .post(
                '/publications/locked-publication-problem-confirmed-co-authors/coauthors/test-user-2/approval-reminder'
            )
            .query({ apiKey: '123456789' });

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('This author has already approved this publication');
    });

    test('Cannot send approval reminder to a user which is not a co-author', async () => {
        const response = await testUtils.agent
            .post(
                '/publications/locked-publication-problem-confirmed-co-authors/coauthors/test-user-22/approval-reminder'
            )
            .query({ apiKey: '123456789' });

        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual('This author does not exist on this publication');
    });

    test('Cannot send approval reminder to the same co-author twice', async () => {
        const response1 = await testUtils.agent
            .post(
                '/publications/publication-problem-locked/coauthors/coauthor-test-user-7-problem-locked/approval-reminder'
            )
            .query({ apiKey: '000000005' });

        expect(response1.status).toEqual(200);
        expect(response1.body.message).toEqual('Reminder sent to test-user-7@jisc.ac.uk');

        const response2 = await testUtils.agent
            .post(
                '/publications/publication-problem-locked/coauthors/coauthor-test-user-7-problem-locked/approval-reminder'
            )
            .query({ apiKey: '000000005' });

        expect(response2.status).toEqual(400);
        expect(response2.body.message).toEqual('You have already sent a reminder to this author');
    });
});
