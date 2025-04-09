import { Prisma } from '@prisma/client';
import * as client from 'lib/client';
import * as testUtils from 'lib/testUtils';

describe('Request co-authors approvals', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Cannot request approvals for a non-existent publication version', async () => {
        const requestApprovals = await testUtils.agent
            .put('/publication-versions/non-existent-publication-version/coauthors/request-approval')
            .query({ apiKey: '123456789' });

        expect(requestApprovals.status).toEqual(404);
        expect(requestApprovals.body.message).toEqual('Publication version not found');
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

    test('Requesting approval sets approvalRequested field to true', async () => {
        const coAuthorQuery: Prisma.CoAuthorsFindManyArgs = {
            where: {
                publicationVersionId: 'publication-problem-draft-v1',
                confirmedCoAuthor: false
            },
            select: {
                approvalRequested: true
            }
        };
        const pendingCoAuthors = await client.prisma.coAuthors.findMany(coAuthorQuery);
        expect(pendingCoAuthors.every((coAuthor) => !coAuthor.approvalRequested)).toBe(true);

        const requestApprovals = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors/request-approval')
            .query({ apiKey: '000000005' });

        expect(requestApprovals.status).toEqual(200);

        const requestedCoAuthors = await client.prisma.coAuthors.findMany(coAuthorQuery);
        expect(requestedCoAuthors.every((coAuthor) => coAuthor.approvalRequested)).toBe(true);
    });

    test('Requesting approval sends emails to co-authors', async () => {
        const requestApprovals = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors/request-approval')
            .query({ apiKey: '000000005' });

        expect(requestApprovals.status).toEqual(200);

        const coAuthorEmails = ['test-user-6@jisc.ac.uk', 'test-user-7@jisc.ac.uk', 'test-user-8@jisc.ac.uk'];

        for (const coAuthorEmail of coAuthorEmails) {
            const findMail = await testUtils.getEmails(coAuthorEmail);
            expect(findMail.messages[0].Subject).toContain('You’ve been added as a co-author on Octopus');
        }
    });

    test('Cannot request approvals for a LIVE publication version', async () => {
        const livePublicationVersionResponse = await testUtils.agent
            .put('/publication-versions/publication-problem-live-v1/coauthors/request-approval')
            .query({ apiKey: '123456789' });

        expect(livePublicationVersionResponse.status).toEqual(400);
        expect(livePublicationVersionResponse.body.message).toEqual(
            'Cannot request approvals for a LIVE publication version.'
        );
    });

    test('Cannot request approvals if user is not the creator', async () => {
        const draftPublicationVersionResponse = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/coauthors/request-approval')
            .query({ apiKey: '000000006' });

        expect(draftPublicationVersionResponse.status).toEqual(403);
        expect(draftPublicationVersionResponse.body.message).toEqual(
            'You are not allowed to request approvals for this publication version.'
        );
    });

    test('Cannot request approvals if publication has no-coauthors', async () => {
        const draftPublicationVersionResponse = await testUtils.agent
            .put('/publication-versions/publication-2-v1/coauthors/request-approval')
            .query({ apiKey: '987654321' });

        expect(draftPublicationVersionResponse.status).toEqual(403);
        expect(draftPublicationVersionResponse.body.message).toEqual('There is no co-author to request approval from.');
    });

    test('Cannot request approvals if publication is not ready to be locked', async () => {
        const draftPublicationVersionResponse = await testUtils.agent
            .put('/publication-versions/publication-method-not-ready-to-lock-v1/coauthors/request-approval')
            .query({ apiKey: '123456789' });

        expect(draftPublicationVersionResponse.status).toEqual(403);
        expect(draftPublicationVersionResponse.body.message).toEqual(
            'Approval emails cannot be sent because the publication is not ready to be LOCKED. Make sure all fields are filled in.'
        );
    });

    test('If publication has previously been locked, coauthor without approval retention receives an email', async () => {
        const requestApprovals = await testUtils.agent
            .put('/publication-versions/publication-hypothesis-draft-v1/coauthors/request-approval')
            .query({ apiKey: '000000005' });

        expect(requestApprovals.status).toEqual(200);

        const findMail = await testUtils.getEmails('test-user-6@jisc.ac.uk');
        expect(findMail.messages[0].Subject).toContain(
            'Changes have been made to a publication that you are an author on'
        );
    });
});
