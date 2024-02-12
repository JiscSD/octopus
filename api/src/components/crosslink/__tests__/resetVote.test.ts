import * as client from 'lib/client';
import * as testUtils from 'lib/testUtils';

describe('Reset a crosslink vote', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can reset their vote on a crosslink', async () => {
        const resetVote = await testUtils.agent
            .delete('/crosslinks/hypothesis-problem-crosslink/vote')
            .query({ apiKey: '000000005' });

        expect(resetVote.status).toEqual(200);

        const dbCheck = await client.prisma.crosslinkVote.findUnique({
            where: {
                crosslinkId_createdBy: {
                    crosslinkId: 'hypothesis-problem-crosslink',
                    createdBy: 'test-user-5'
                }
            }
        });
        expect(dbCheck).toEqual(null);
    });

    test('User cannot reset their vote when they have not voted on the crosslink', async () => {
        const resetVote = await testUtils.agent
            .delete('/crosslinks/hypothesis-problem-crosslink/vote')
            .query({ apiKey: '000000004' });

        expect(resetVote.status).toEqual(404);
        expect(resetVote.body.message).toEqual('You have not voted on this crosslink.');
    });

    test('Anonymous user cannot reset a vote', async () => {
        const resetVote = await testUtils.agent.delete('/crosslinks/hypothesis-problem-crosslink/vote');

        expect(resetVote.status).toEqual(401);
    });

    test('User cannot reset their vote on a non-existent crosslink', async () => {
        const resetVote = await testUtils.agent
            .delete('/crosslinks/made-up-crosslink/vote')
            .query({ apiKey: '000000005' });

        expect(resetVote.status).toEqual(404);
        expect(resetVote.body.message).toEqual('Crosslink not found.');
    });
});
