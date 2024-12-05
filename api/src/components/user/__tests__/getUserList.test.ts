import * as testUtils from 'lib/testUtils';

describe('Get user list with apiKey', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Returns 401 if apiKey is not valid', async () => {
        const response = await testUtils.agent.get('/user-list?apiKey=123');

        expect(response.status).toEqual(401);
    });

    test('Returns user list if valid apiKey is provided', async () => {
        const response = await testUtils.agent.get(`/user-list?apiKey=${process.env.LIST_USERS_API_KEY}`);

        expect(response.status).toEqual(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
