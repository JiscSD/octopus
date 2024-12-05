import * as testUtils from 'lib/testUtils';
import * as I from 'lib/interface';

describe('Get Users', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Get all users', async () => {
        const response = await testUtils.agent.get('/users?limit=100');
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(13);
        expect(response.body.metadata.total).toEqual(13);
    });

    test('Get first 10 users if "limit" param is not provided', async () => {
        const response = await testUtils.agent.get('/users');
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(10); // default limit is 10
        expect(response.body.metadata.total).toEqual(13);
    });

    test('Get first 2 users', async () => {
        const response = await testUtils.agent.get('/users?limit=2');
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(2);
        expect(response.body.metadata.total).toEqual(13);
    });

    test('Get first 2 users which have their first or last name "Test"', async () => {
        const response = await testUtils.agent.get('/users?limit=2&search=Test');
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(2);
        expect(response.body.data.every((user: I.User) => `${user.firstName} ${user.lastName}`.includes('Test'))).toBe(
            true
        );
        expect(response.body.metadata.total).toEqual(12);
    });

    test('Get "Octopus" user by searching for "Octopus"', async () => {
        const response = await testUtils.agent.get('/users?search=Octopus');
        expect(response.status).toEqual(200);
        expect(response.body.data).toMatchObject([
            {
                id: 'octopus',
                firstName: 'Octopus'
            }
        ]);
    });

    test('Partial matches work on firstName/lastName', async () => {
        const testResponse1 = await testUtils.agent.get('/users?search=Octo');
        expect(testResponse1.status).toEqual(200);
        expect(testResponse1.body.data.length).toEqual(1);
        expect(testResponse1.body.metadata.total).toEqual(1);

        const testResponse2 = await testUtils.agent.get('/users?search=Coauth');
        expect(testResponse2.status).toEqual(200);
        expect(testResponse2.body.data.length).toEqual(6);
        expect(testResponse2.body.metadata.total).toEqual(6);
    });

    test('Can filter by role', async () => {
        const response = await testUtils.agent.get('/users?role=USER');
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(9);
        expect(response.body.metadata.total).toEqual(9);
    });

    test('Filtering by ORGANISATION role excludes accounts without any live publication versions', async () => {
        const response = await testUtils.agent.get('/users?role=ORGANISATION');
        expect(response.status).toEqual(200);
        expect(response.body.data.some((user) => user.id === 'test-organisational-account-2')).toBe(false);
    });

    test('Can filter by role and name query at once', async () => {
        const response = await testUtils.agent.get('/users?role=ORGANISATION&search=department');
        expect(response.status).toEqual(200);
        expect(response.body.data).toMatchObject([
            {
                id: 'test-organisational-account-1',
                firstName: 'Test ARI Department (UK)'
            }
        ]);
    });
});
