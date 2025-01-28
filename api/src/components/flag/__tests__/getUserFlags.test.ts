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
        const flags = getUserFlags.body.data;

        for (const flag of flags) {
            expect(flag.resolved).toEqual(false);
        }
    });

    test('Resolved flags can be included with includeResolved query param', async () => {
        const getUserFlags = await testUtils.agent.get('/users/test-user-2/flags').query({
            includeResolved: true
        });
        const flags = getUserFlags.body.data;
        // Not the actual type but just to avoid implicit "any" typed value.
        expect(flags.some((flag: { resolved: boolean }) => flag.resolved)).toEqual(true);
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

    test('Results can be limited', async () => {
        const getUserFlags = await testUtils.agent.get('/users/test-user-2/flags').query({
            includeResolved: true,
            limit: 1
        });
        expect(getUserFlags.status).toEqual(200);
        expect(getUserFlags.body.data).toHaveLength(1);
        expect(getUserFlags.body.metadata.total).toBeGreaterThan(1);
    });

    test('Results can be offset', async () => {
        // Get default results first
        const getUserFlags = await testUtils.agent.get('/users/test-user-2/flags').query({
            includeResolved: true
        });
        expect(getUserFlags.status).toEqual(200);

        const getOffsetUserFlags = await testUtils.agent.get('/users/test-user-2/flags').query({
            includeResolved: true,
            offset: 1
        });
        expect(getOffsetUserFlags.status).toEqual(200);
        expect(getOffsetUserFlags.body.data[0].id).toEqual(getUserFlags.body.data[1].id);
    });
});
