import * as testUtils from 'lib/testUtils';

describe('Vote on a crosslink', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can vote on a crosslink', async () => {
        const setVote = await testUtils.agent
            .put('/crosslinks/hypothesis-problem-crosslink/vote')
            .query({ apiKey: '987654321' })
            .send({
                vote: true
            });

        expect(setVote.status).toEqual(200);
    });

    test('Anonymous user cannot vote on a crosslink', async () => {
        const setVote = await testUtils.agent.put('/crosslinks/hypothesis-problem-crosslink/vote').send({
            vote: true
        });

        expect(setVote.status).toEqual(401);
    });

    test('User cannot vote on an invalid crosslink ID', async () => {
        const setVote = await testUtils.agent
            .put('/crosslinks/made-up-crosslink/vote')
            .query({ apiKey: '987654321' })
            .send({
                vote: true
            });

        expect(setVote.status).toEqual(404);
        expect(setVote.body.message).toEqual('Crosslink not found.');
    });

    test('User must supply a vote value', async () => {
        const setVote = await testUtils.agent.put('/crosslinks/made-up-crosslink/vote').query({ apiKey: '987654321' });

        expect(setVote.status).toEqual(400);
        expect(setVote.body.message[0].params).toEqual({ missingProperty: 'vote' });
    });

    test('User must supply a boolean vote value', async () => {
        const setVote = await testUtils.agent
            .put('/crosslinks/made-up-crosslink/vote')
            .query({ apiKey: '987654321' })
            .send({
                vote: 'up'
            });

        expect(setVote.status).toEqual(400);
        expect(setVote.body.message[0].message).toEqual('must be boolean');
    });
});
