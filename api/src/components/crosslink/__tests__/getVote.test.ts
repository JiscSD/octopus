import * as testUtils from 'lib/testUtils';

describe('Get own crosslink vote', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can get their own crosslink vote', async () => {
        const getVote = await testUtils.agent
            .get('/crosslinks/problem-live-crosslink-1/vote')
            .query({ apiKey: '000000007' });

        expect(getVote.status).toEqual(200);
        expect(getVote.body).toEqual({
            crosslinkId: 'problem-live-crosslink-1',
            createdBy: 'test-user-7',
            vote: true
        });
    });

    test('User who has not voted is notified as such', async () => {
        const getVote = await testUtils.agent
            .get('/crosslinks/problem-live-crosslink-1/vote')
            .query({ apiKey: '000000003' });

        expect(getVote.status).toEqual(404);
        expect(getVote.body.message).toEqual('You have not voted on this crosslink.');
    });

    test('Anonymous user cannot get their vote', async () => {
        const getVote = await testUtils.agent.get('/crosslinks/hypothesis-problem-crosslink/vote');

        expect(getVote.status).toEqual(401);
    });

    test('Cannot get vote for an invalid crosslink ID', async () => {
        const getVote = await testUtils.agent.get('/crosslinks/made-up-crosslink/vote').query({ apiKey: '000000007' });

        expect(getVote.status).toEqual(404);
        expect(getVote.body.message).toEqual('Crosslink not found.');
    });
});
