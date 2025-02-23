import * as testUtils from 'lib/testUtils';

describe('Get a crosslink', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Anonymous user can get a crosslink', async () => {
        const getCrosslink = await testUtils.agent.get('/crosslinks/problem-live-crosslink-1');

        expect(getCrosslink.status).toEqual(200);
        expect(getCrosslink.body).toEqual({
            id: 'problem-live-crosslink-1',
            publications: [
                {
                    id: 'publication-problem-live-2',
                    title: 'Publication PROBLEM-LIVE 2'
                },
                {
                    id: 'publication-problem-live',
                    title: 'Publication PROBLEM-LIVE v2'
                }
            ],
            upvotes: 4,
            downvotes: 1,
            createdBy: 'test-user-1',
            createdAt: '2024-01-22T10:00:00.000Z'
        });
    });

    test('User cannot get a crosslink with an invalid ID', async () => {
        const getCrosslink = await testUtils.agent.get('/crosslinks/made-up-crosslink');

        expect(getCrosslink.status).toEqual(404);
        expect(getCrosslink.body.message).toEqual('Crosslink not found.');
    });

    test('User can get a crosslink by providing two publication IDs', async () => {
        const getCrosslink = await testUtils.agent.get(
            '/crosslinks/publication-problem-live-2,publication-problem-live'
        );

        expect(getCrosslink.status).toEqual(200);
        expect(getCrosslink.body.publications).toEqual([
            {
                id: 'publication-problem-live-2',
                title: 'Publication PROBLEM-LIVE 2'
            },
            {
                id: 'publication-problem-live',
                title: 'Publication PROBLEM-LIVE v2'
            }
        ]);
    });

    test('User cannot get a crosslink by providing invalid publication ID(s)', async () => {
        const getCrosslink = await testUtils.agent.get('/crosslinks/publication-problem-live,made-up-publication');

        expect(getCrosslink.status).toEqual(404);
        expect(getCrosslink.body.message).toEqual('Crosslink not found.');
    });
});
