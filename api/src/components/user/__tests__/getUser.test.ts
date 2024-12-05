import * as testUtils from 'lib/testUtils';

describe('Get individual user', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Correct user returned', async () => {
        const user = await testUtils.agent.get('/users/test-user-1');

        expect(user.status).toEqual(200);
        expect(user.body.firstName).toEqual('Test');
    });

    test('User not found', async () => {
        const user = await testUtils.agent.get('/users/test-user-100');

        expect(user.status).toEqual(404);
    });
});
