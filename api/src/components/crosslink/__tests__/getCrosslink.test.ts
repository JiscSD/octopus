import * as testUtils from 'lib/testUtils';

describe('Get a crosslink', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Anonymous user can get a crosslink', async () => {
        const getCrosslink = await testUtils.agent.get('/crosslinks/problem-live-crosslink-1');

        expect(getCrosslink.status).toEqual(200);
        expect(getCrosslink.body.publications).toEqual([
            {
                id: 'publication-problem-live-2',
                versions: [
                    {
                        title: 'Publication PROBLEM-LIVE 2'
                    }
                ]
            },
            {
                id: 'publication-problem-live',
                versions: [
                    {
                        title: 'Publication PROBLEM-LIVE v2'
                    }
                ]
            }
        ]);
        expect(getCrosslink.body.upVotes).toEqual(4);
        expect(getCrosslink.body.downVotes).toEqual(1);
        expect(getCrosslink.body.createdBy).toEqual('test-user-1');
    });

    test('User cannot get a crosslink with an invalid ID', async () => {
        const getCrosslink = await testUtils.agent.get('/crosslinks/made-up-crosslink');

        expect(getCrosslink.status).toEqual(404);
        expect(getCrosslink.body.message).toEqual('Crosslink not found.');
    });
});
