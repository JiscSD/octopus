import * as testUtils from 'lib/testUtils';

describe('Get flags created by a user', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Anonymous user can get flags created by a user', async () => {
        const getUserFlags = await testUtils.agent.get('/users/test-user-2/flags');
        expect(getUserFlags.status).toEqual(200);
    });

    test('Returned flags are all unresolved by default', async () => {
        const getUserFlags = await testUtils.agent.get('/users/test-user-2/flags');
        const flags = getUserFlags.body;

        for (const flag of flags) {
            expect(flag.resolved).toEqual(false);
        }
    });

    test('Resolved flags can be included with includeResolved query param', async () => {
        const getUserFlags = await testUtils.agent.get('/users/test-user-2/flags').query({
            includeResolved: true
        });
        const flags = getUserFlags.body;
        expect(flags.some((flag: { resolved: boolean; [key: string]: any }) => flag.resolved)).toEqual(true);
    });

    test('Invalid values for includeResolved param are rejected', async () => {
        const getUserFlags = await testUtils.agent.get('/users/test-user-2/flags').query({
            includeResolved: 'Apple'
        });
        expect(getUserFlags.status).toEqual(400);
        expect(getUserFlags.body.message).toHaveLength(1);
        expect(getUserFlags.body.message[0].keyword).toEqual('type');
        expect(getUserFlags.body.message[0].message).toEqual('must be boolean');
    });

    test('Unexpected query params are rejected', async () => {
        const getUserFlags = await testUtils.agent.get('/users/test-user-2/flags').query({
            date: '2020-01-01'
        });
        expect(getUserFlags.status).toEqual(400);
        expect(getUserFlags.body.message).toHaveLength(1);
        expect(getUserFlags.body.message[0].keyword).toEqual('additionalProperties');
    });
});
