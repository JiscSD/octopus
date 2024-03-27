import * as testUtils from 'lib/testUtils';

describe('Authorization tests', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User without firstName or lastName cannot use an endpoint that requires a name', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({ apiKey: '000000011' })
            .send({
                type: 'PROBLEM',
                title: 'My anonymous publication'
            });

        expect(createPublicationRequest.status).toEqual(403);
        expect(createPublicationRequest.body.message).toEqual(
            'No name detected. Please ensure your name visibility is set to "Everyone" or "Trusted parties" on your ORCiD account, then re-authorize at /authorization.'
        );
    });
});
