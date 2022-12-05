import * as testUtils from 'lib/testUtils';
import * as I from 'lib/interface';

describe('Get Users', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Get all users', async () => {
        const response = await testUtils.agent.get('/users?limit=100');
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(11);
        expect(response.body.metadata.total).toEqual(11);
    });

    test('Get first 10 users if "limit" param is not provided', async () => {
        const response = await testUtils.agent.get('/users');
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(10); // default limit is 10
        expect(response.body.metadata.total).toEqual(11);
    });

    test('Get first 2 users', async () => {
        const response = await testUtils.agent.get('/users?limit=2');
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(2);
        expect(response.body.metadata.total).toEqual(11);
    });

    test('Get first 2 users which have their first or last name "Test"', async () => {
        const response = await testUtils.agent.get('/users?limit=2&search=Test');
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(2);
        expect(response.body.data.every((user: I.User) => `${user.firstName} ${user.lastName}`.includes('Test'))).toBe(
            true
        );
        expect(response.body.metadata.total).toEqual(10);
    });

    test('Get "Science Octopus" user by searching for "Science"', async () => {
        const response = await testUtils.agent.get('/users?search=Science');
        expect(response.status).toEqual(200);
        expect(response.body.data.length).toEqual(1);
        const user = response.body.data[0];
        expect(`${user.firstName} ${user.lastName}`).toEqual('Science Octopus');
    });

    test('Returns no user if searching for incomplete firstName/lastName', async () => {
        const testResponse1 = await testUtils.agent.get('/users?search=Sci');
        expect(testResponse1.status).toEqual(200);
        expect(testResponse1.body.data.length).toEqual(0);
        expect(testResponse1.body.metadata.total).toEqual(0);

        const testResponse2 = await testUtils.agent.get('/users?search=Te');
        expect(testResponse2.status).toEqual(200);
        expect(testResponse2.body.data.length).toEqual(0);
        expect(testResponse2.body.metadata.total).toEqual(0);
    });
});
