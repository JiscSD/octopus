import * as testUtils from 'lib/testUtils';

describe('Get individual user', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('Correct user returned', async () => {
        const user = await testUtils.agent.get('/users/test-user-1');

        expect(user.status).toEqual(200);
        expect(user.body.firstName).toEqual('Test');
    });

    test('User not found', async () => {
        const user = await testUtils.agent.get('/users/test-user-3');

        expect(user.status).toEqual(404);
    });
});
