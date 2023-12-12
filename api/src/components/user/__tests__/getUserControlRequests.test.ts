import * as testUtils from 'lib/testUtils';

describe('Get user control requests', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Unauthenticated user cannot retrieve their control requests', async () => {
        const user = await testUtils.agent.get('/users/me/control-requests');

        expect(user.status).toEqual(401);
        expect(user.body.message).toEqual('Please enter either a valid apiKey or bearer token.');
    });

    test('Logged in user can retrieve their control requests', async () => {
        const user = await testUtils.agent.get('/users/me/control-requests').query({
            apiKey: '987654321'
        });

        expect(user.status).toEqual(200);
        expect(user.body.length).toEqual(1);
        expect(user.body[0].type).toEqual('REQUEST_CONTROL');
    });
});
