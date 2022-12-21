import * as testUtils from 'lib/testUtils';

describe('Get a given users publications', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Current user can view publications including drafts', async () => {
        const publications = await testUtils.agent
            .get('/users/test-user-1/publications')
            .query({ apiKey: 123456789, offset: 0, limit: 100 });

        expect(publications.status).toEqual(200);
        expect(publications.body.results.length).toEqual(19);
    });

    test('Unauthenticated user can only view live publications', async () => {
        const publications = await testUtils.agent.get('/users/test-user-1/publications');

        expect(publications.status).toEqual(200);
        expect(publications.body.results.length).toEqual(8);
    });

    test('An authenticated user can only view live publications of another user', async () => {
        const publications = await testUtils.agent.get('/users/test-user-1/publications').query({ apiKey: 987654321 });

        expect(publications.status).toEqual(200);
        expect(publications.body.results.length).toEqual(8);
    });

    test('Error message returned for a user that does not exist', async () => {
        const publications = await testUtils.agent
            .get('/users/user-does-not-exist/publications')
            .query({ apiKey: 987654321 });

        expect(publications.body.results).toBe(undefined);
        expect(publications.body.message).toBe('User not found');
        expect(publications.status).toEqual(400);
    });
});
