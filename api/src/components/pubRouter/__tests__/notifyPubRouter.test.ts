import * as testUtils from 'lib/testUtils';

beforeAll(async () => {
    await testUtils.clearDB();
    await testUtils.testSeed();
});

describe('Notify pubRouter of a publication', () => {
    test('Notify of existing non-seed publication', async () => {
        const response = await testUtils.agent.post('/publications/publication-problem-live/notifyPubRouter');

        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('Successfully submitted to publications router');
    });

    test('Notify of seed publication', async () => {
        const response = await testUtils.agent.post('/publications/seed-publication/notifyPubRouter');

        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('Publication author is Octopus user, ignoring');
    });

    test('Notify of non-existent publication', async () => {
        const response = await testUtils.agent.post('/publications/made-up-publication/notifyPubRouter');

        expect(response.status).toEqual(404);
        expect(response.body.message).toEqual('Publication version not found.');
    });
});
