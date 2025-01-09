import * as testUtils from 'lib/testUtils';

describe('Resolve a flag', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('The flagger can resolve the flag', async () => {
        const resolveFlag = await testUtils.agent.post('/flags/publication-problem-live-flag-1/resolve').query({
            apiKey: '987654321'
        });

        expect(resolveFlag.status).toEqual(200);
    });

    test('Only the flagger or super user can resolve the flag', async () => {
        const resolveFlag = await testUtils.agent.post('/flags/publication-problem-live-flag-1/resolve').query({
            apiKey: '123456789'
        });

        expect(resolveFlag.status).toEqual(403);
    });

    test('A super user can resolve the flag', async () => {
        const resolveFlag = await testUtils.agent.post('/flags/publication-problem-live-flag-1/resolve').query({
            apiKey: '000000004'
        });

        expect(resolveFlag.status).toEqual(200);
    });

    test('An unrelated user cannot resolve a flag', async () => {
        const resolveFlag = await testUtils.agent.post('/flags/publication-problem-live-flag-1/resolve').query({
            apiKey: '000000003'
        });

        expect(resolveFlag.status).toEqual(403);
    });

    test('You cannot resolve a flag that has already been resolved', async () => {
        const resolveFlag = await testUtils.agent.post('/flags/publication-hypothesis-live-flag/resolve').query({
            apiKey: '987654321'
        });

        expect(resolveFlag.status).toEqual(400);
    });

    test('You can only resolve a flag that exists', async () => {
        const resolveFlag = await testUtils.agent.post('/flags/publication-does-not-exist-flag/resolve').query({
            apiKey: '987654321'
        });

        expect(resolveFlag.status).toEqual(404);
    });
});
