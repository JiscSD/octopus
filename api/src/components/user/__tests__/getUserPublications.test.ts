import * as testUtils from 'lib/testUtils';

describe('Get a given users publication versions', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Current user can view publication versions including drafts', async () => {
        const versions = await testUtils.agent
            .get('/users/test-user-1/publication-versions')
            .query({ apiKey: 123456789, offset: 0, limit: 100 });

        expect(versions.status).toEqual(200);
        expect(versions.body.results.length).toEqual(20);
    });

    test('Unauthenticated user can only view live versions', async () => {
        const versions = await testUtils.agent.get('/users/test-user-1/publication-versions');

        expect(versions.status).toEqual(200);
        expect(versions.body.results.length).toEqual(8);
    });

    test('An authenticated user can only view live versions of another user', async () => {
        const versions = await testUtils.agent
            .get('/users/test-user-1/publication-versions')
            .query({ apiKey: 987654321 });

        expect(versions.status).toEqual(200);
        expect(versions.body.results.length).toEqual(8);
    });

    test('Error message returned for a user that does not exist', async () => {
        const versions = await testUtils.agent
            .get('/users/user-does-not-exist/publication-versions')
            .query({ apiKey: 987654321 });

        expect(versions.body.results).toBe(undefined);
        expect(versions.body.message).toBe('User not found');
        expect(versions.status).toEqual(400);
    });
});
