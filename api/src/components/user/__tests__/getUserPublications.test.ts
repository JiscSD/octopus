import { Prisma } from '@prisma/client';
import * as testUtils from 'lib/testUtils';
import * as userService from 'user/service';

type UserPublications = Prisma.PromiseReturnType<typeof userService.getPublications>;

describe("Get a given user's publications", () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Current user can view publications including draft versions', async () => {
        const publications = await testUtils.agent
            .get('/users/test-user-1/publications')
            .query({ apiKey: 123456789, offset: 0, limit: 100 });

        expect(publications.status).toEqual(200);
        expect(publications.body.data.length).toEqual(25);
        expect(
            publications.body.data.some(
                (publication) => publication.versions.some((version) => version.currentStatus === 'DRAFT') as boolean
            )
        ).toEqual(true);
    });

    test('Unauthenticated user can only view publications with a live version', async () => {
        const publications = await testUtils.agent.get('/users/test-user-1/publications');

        expect(publications.status).toEqual(200);
        expect(publications.body.data.length).toEqual(10);
        expect(
            publications.body.data.some(
                (publication) => publication.versions.some((version) => version.currentStatus === 'DRAFT') as boolean
            )
        ).toEqual(false);
    });

    test('An authenticated user can only view live publications of another user', async () => {
        const publications = await testUtils.agent.get('/users/test-user-1/publications').query({ apiKey: 987654321 });

        expect(publications.status).toEqual(200);
        expect(publications.body.data.length).toEqual(10);
        expect(
            publications.body.data.some(
                (publication) => publication.versions.some((version) => version.currentStatus === 'DRAFT') as boolean
            )
        ).toEqual(false);
    });

    test('Error message returned for a user that does not exist', async () => {
        const publications = await testUtils.agent
            .get('/users/user-does-not-exist/publications')
            .query({ apiKey: 987654321 });

        expect(publications.body.data).toBe(undefined);
        expect(publications.body.message).toBe('User not found');
        expect(publications.status).toEqual(400);
    });

    test('Results can be filtered by a query term', async () => {
        const queryTerm = 'interpretation';
        const publications = await testUtils.agent.get('/users/test-user-1/publications').query({ query: queryTerm });

        expect(publications.status).toEqual(200);
        expect(publications.body.data.length).toEqual(1);
        expect(
            (publications.body as UserPublications).data.every((publication) =>
                publication.versions.some(
                    (version) => version.isLatestLiveVersion && version.title?.toLowerCase().includes(queryTerm)
                )
            )
        ).toEqual(true);
    });

    test('Results can be filtered to publications having at least one version currently in a given status', async () => {
        const publications = await testUtils.agent
            .get('/users/test-user-1/publications')
            .query({ apiKey: 123456789, versionStatus: 'DRAFT' });

        expect(publications.status).toEqual(200);
        expect(publications.body.data.length).toEqual(10); // a full page
        expect(
            (publications.body as UserPublications).data.every((publication) =>
                publication.versions.some((version) => version.currentStatus === 'DRAFT')
            )
        ).toEqual(true);
    });

    test('versionStatus param cannot be used if initialDraftsOnly param is true', async () => {
        const publications = await testUtils.agent
            .get('/users/test-user-1/publications')
            .query({ apiKey: 123456789, versionStatus: 'DRAFT', initialDraftsOnly: true });

        expect(publications.status).toEqual(400);
        expect(publications.body.message).toBe(
            'The "versionStatus" query parameter cannot be used when "initialDraftsOnly" is set to true.'
        );
    });

    test('versionStatus param can be used if initialDraftsOnly param is false', async () => {
        const publications = await testUtils.agent
            .get('/users/test-user-1/publications')
            .query({ apiKey: 123456789, versionStatus: 'DRAFT', initialDraftsOnly: false });

        expect(publications.status).toEqual(200);
    });

    test('Only initial drafts are returned if initialDraftsOnly param is true', async () => {
        const publications = await testUtils.agent
            .get('/users/test-user-1/publications')
            .query({ apiKey: 123456789, initialDraftsOnly: true });

        expect(publications.status).toEqual(200);
        expect(publications.body.data.length).toBeGreaterThan(0);
        // Every version on every publication should be a draft, and the only version.
        expect(
            (publications.body as UserPublications).data.every(
                (publication) =>
                    publication.versions.length === 1 &&
                    publication.versions[0].currentStatus === 'DRAFT' &&
                    publication.versions[0].versionNumber === 1
            )
        ).toEqual(true);
    });
});
