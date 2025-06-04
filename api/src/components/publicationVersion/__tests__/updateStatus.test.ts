import { Prisma } from '@prisma/client';
import * as testUtils from 'lib/testUtils';
import * as client from 'lib/client';

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

        expect(updatePublicationVersion.status).toEqual(400);
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
            .put('/publication-versions/locked-publication-problem-confirmed-co-authors-v1/status/LIVE')
            .query({
                apiKey: '123456789'
            });

        expect(updatePublicationVersion.status).toEqual(200);

        expect(updatePublicationVersion.body.message).toEqual('Publication is now LIVE.');
    });

    test('Publication owner cannot publish if not all co-authors are confirmed', async () => {
        const updatePublicationVersion = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/status/LIVE')
            .query({
                apiKey: '000000005'
            });

        expect(updatePublicationVersion.status).toEqual(403);
        expect(updatePublicationVersion.body.message).toEqual(
            'Publication is not ready to be made LIVE. Make sure all fields are filled in.'
        );

        const getPublicationVersion = await testUtils.agent
            .get('/publications/publication-problem-draft/publication-versions/latest')
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

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('Publication status is already DRAFT.');
    });

    test('Corresponding author needs valid affiliation status before locking the publication', async () => {
        // Invalidate affiliation status.
        await client.prisma.coAuthors.update({
            where: {
                id: 'coauthor-test-user-5-problem-draft'
            },
            data: {
                isIndependent: false,
                affiliations: []
            }
        });

        const updateStatusResponse = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/status/LOCKED')
            .query({ apiKey: '000000005' })
            .send();

        expect(updateStatusResponse.status).toEqual(403);
        expect(updateStatusResponse.body.message).toEqual(
            'Publication is not ready to be LOCKED. Make sure all fields are filled in.'
        );
    });

    test('Publication status cannot be updated from DRAFT to LOCKED if missing mandatory data', async () => {
        const updateStatusResponse = await testUtils.agent
            .put('/publication-versions/publication-method-not-ready-to-lock-v1/status/LOCKED')
            .query({
                apiKey: '123456789'
            });

        expect(updateStatusResponse.status).toEqual(403);
        expect(updateStatusResponse.body.message).toEqual(
            'Publication is not ready to be LOCKED. Make sure all fields are filled in.'
        );
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

    test('Publication status can be updated from LOCKED to DRAFT', async () => {
        const response = await testUtils.agent
            .put('/publication-versions/publication-problem-locked-1-v1/status/DRAFT')
            .query({
                apiKey: '000000005'
            });

        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('Publication unlocked for editing');

        const version = await client.prisma.publicationVersion.findUnique({
            where: {
                id: 'publication-problem-locked-1-v1'
            },
            select: {
                currentStatus: true
            }
        });
        expect(version?.currentStatus).toEqual('DRAFT');
    });

    test('Changing status to DRAFT from LOCKED resets coauthors if they do not have approval retention set', async () => {
        const response = await testUtils.agent
            .put('/publication-versions/locked-publication-problem-confirmed-co-authors-v1/status/DRAFT')
            .query({
                apiKey: '123456789'
            });

        expect(response.status).toEqual(200);

        const coAuthors = await client.prisma.coAuthors.findMany({
            where: {
                publicationVersionId: 'locked-publication-problem-confirmed-co-authors-v1',
                retainApproval: false
            }
        });

        expect(coAuthors.length).toBeGreaterThan(0);
        expect(coAuthors.every((coAuthor) => coAuthor.confirmedCoAuthor === false)).toBe(true);
    });

    test('Changing status to DRAFT from LOCKED does not reset coauthors if they have approval retention set', async () => {
        const applicableCoAuthorQuery: Prisma.CoAuthorsFindManyArgs = {
            where: {
                publicationVersionId: 'publication-problem-locked-1-v1',
                approvalRequested: true,
                retainApproval: true,
                confirmedCoAuthor: true
            },
            select: {
                id: true,
                code: true,
                confirmedCoAuthor: true
            }
        };
        const applicableCoAuthorsBefore = await client.prisma.coAuthors.findMany(applicableCoAuthorQuery);
        expect(applicableCoAuthorsBefore.length).toBeGreaterThan(0);

        const response = await testUtils.agent
            .put('/publication-versions/publication-problem-locked-1-v1/status/DRAFT')
            .query({
                apiKey: '000000005'
            });

        expect(response.status).toEqual(200);

        const applicableCoAuthorsAfter = await client.prisma.coAuthors.findMany(applicableCoAuthorQuery);

        expect(applicableCoAuthorsAfter.length).toBe(applicableCoAuthorsBefore.length);
        expect(
            applicableCoAuthorsAfter.every((coAuthor) => {
                const oldCoAuthor = applicableCoAuthorsBefore.find((oldCoAuthor) => oldCoAuthor.id === coAuthor.id);

                return coAuthor.confirmedCoAuthor && coAuthor.code === oldCoAuthor?.code;
            })
        ).toBe(true);
    });

    test('User can publish a new version for an existing publication', async () => {
        // seed OpenSearch records first
        await testUtils.openSearchSeed();

        // publish the newest created version
        const publishNewVersion = await testUtils.agent
            .put(`/publication-versions/publication-problem-live-2-v2/status/LIVE`)
            .query({
                apiKey: '123456789'
            });

        expect(publishNewVersion.status).toEqual(200);
        expect(publishNewVersion.body.message).toEqual('Publication is now LIVE.');

        const newestPublishedVersion = await testUtils.agent.get(
            '/publications/publication-problem-live-2/publication-versions/latest'
        );

        expect(newestPublishedVersion.status).toEqual(200);
        expect(newestPublishedVersion.body.id).toEqual('publication-problem-live-2-v2');
        expect(newestPublishedVersion.body.currentStatus).toEqual('LIVE');
        expect(newestPublishedVersion.body.doi).not.toEqual(null); // the new version now has a DOI generated
        expect(typeof newestPublishedVersion.body.doi).toBe('string');
        expect(newestPublishedVersion.body.versionNumber).toEqual(2); // version 2 published
        expect(newestPublishedVersion.body.isLatestLiveVersion).toBe(true);
    });

    test("Links from peer reviews are updated to point to latest live version of 'to publication' when peer review is published", async () => {
        await testUtils.openSearchSeed();
        // PR already has link to publication-problem-live-2-v1
        await testUtils.agent.put(`/publication-versions/publication-problem-live-2-v2/status/LIVE`).query({
            apiKey: '123456789'
        });
        await testUtils.agent.put('/publication-versions/publication-peer-review-draft-v1/status/LIVE').query({
            apiKey: '123456789'
        });
        const link = await client.prisma.links.findFirst({
            where: {
                publicationFromId: 'publication-peer-review-draft',
                publicationToId: 'publication-problem-live-2'
            },
            select: {
                versionToId: true
            }
        });
        expect(link?.versionToId).toEqual('publication-problem-live-2-v2');
    });

    test("Links from non-peer reviews do not change versionTo when 'from publication' is published", async () => {
        await testUtils.openSearchSeed();
        // Publication already has link to publication-problem-live-2-v1
        await testUtils.agent.put(`/publication-versions/publication-problem-live-2-v2/status/LIVE`).query({
            apiKey: '123456789'
        });
        await testUtils.agent
            .put('/publication-versions/publication-real-world-application-draft-v1/status/LIVE')
            .query({
                apiKey: '123456789'
            });
        const link = await client.prisma.links.findFirst({
            where: {
                publicationFromId: 'publication-real-world-application-draft',
                publicationToId: 'publication-problem-live-2'
            },
            select: {
                versionToId: true
            }
        });
        expect(link?.versionToId).toEqual('publication-problem-live-2-v1');
    });

    test('ARI consent query parameter rejects non-boolean values', async () => {
        const updatePublicationVersionAttempt = await testUtils.agent
            .put('/publication-versions/publication-analysis-draft-v1/status/LIVE')
            .query({
                apiKey: '123456789',
                ariContactConsent: 'string'
            });

        expect(updatePublicationVersionAttempt.status).toEqual(400);
        expect(updatePublicationVersionAttempt.body.message[0].instancePath).toEqual('/ariContactConsent');
        expect(updatePublicationVersionAttempt.body.message[0].keyword).toEqual('type');
    });

    test('ARI consent query parameter rejected when new status is not LIVE', async () => {
        const updatePublicationVersionAttempt = await testUtils.agent
            .put('/publication-versions/publication-problem-draft-v1/status/LOCKED')
            .query({
                apiKey: '000000005',
                ariContactConsent: true
            });

        expect(updatePublicationVersionAttempt.status).toEqual(400);
        expect(updatePublicationVersionAttempt.body.message).toEqual(
            'ARI contact consent is only applicable when changing status to LIVE.'
        );
    });

    test('ARI consent query parameter rejected when no draft links to ARI publications exist', async () => {
        const updatePublicationVersionAttempt = await testUtils.agent
            .put('/publication-versions/publication-analysis-draft-v1/status/LIVE')
            .query({
                apiKey: '123456789',
                ariContactConsent: true
            });

        expect(updatePublicationVersionAttempt.status).toEqual(400);
        expect(updatePublicationVersionAttempt.body.message).toEqual(
            'A draft link to an ARI publication must exist from this publication if you provide the ariContactConsent parameter.'
        );
    });

    test('ARI consent query parameter is accepted if publication is newly linked to an ARI', async () => {
        const updatePublicationVersionAttempt = await testUtils.agent
            .put('/publication-versions/publication-hypothesis-draft-problem-live-v1/status/LIVE')
            .query({
                apiKey: '123456789',
                ariContactConsent: true
            });

        expect(updatePublicationVersionAttempt.status).toEqual(200);
    });

    test('A publication linked to a draft can be LOCKED', async () => {
        const updatePublicationVersionAttempt = await testUtils.agent
            .put('/publication-versions/publication-protocol-draft-v1/status/LOCKED')
            .query({
                apiKey: '000000005'
            });

        expect(updatePublicationVersionAttempt.status).toEqual(200);
    });

    test('A publication linked to a draft cannot be made LIVE', async () => {
        const updatePublicationVersionAttempt = await testUtils.agent
            .put('/publication-versions/publication-problem-locked-2-v1/status/LIVE')
            .query({
                apiKey: '000000005'
            });

        expect(updatePublicationVersionAttempt.status).toEqual(403);
        expect(updatePublicationVersionAttempt.body.message).toEqual(
            'One or more linked publications are still in draft. Please ensure all linked publications are live before publishing this one.'
        );
    });
});
