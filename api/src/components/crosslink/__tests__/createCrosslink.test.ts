import * as testUtils from 'lib/testUtils';

describe('Create a crosslink', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can add a crosslink between two publications', async () => {
        const addCrossLink = await testUtils.agent
            .post('/crosslinks')
            .query({ apiKey: '123456789' })
            .send({
                publications: ['publication-problem-live', 'publication-data-live']
            });

        expect(addCrossLink.status).toEqual(200);
    });

    test('User cannot add a crosslink between two publications that are already crosslinked', async () => {
        const addCrossLink = await testUtils.agent
            .post('/crosslinks')
            .query({ apiKey: '123456789' })
            .send({
                publications: ['publication-problem-live', 'publication-hypothesis-live']
            });

        expect(addCrossLink.status).toEqual(400);
        expect(addCrossLink.body.message).toEqual('A crosslink already exists between these publications');
    });

    test('User cannot create a crosslink involving an invalid publication ID', async () => {
        const addCrossLink = await testUtils.agent
            .post('/crosslinks')
            .query({ apiKey: '123456789' })
            .send({
                publications: ['publication-problem-live', 'made-up-id']
            });

        expect(addCrossLink.status).toEqual(404);
        expect(addCrossLink.body.message).toEqual('One or both of the publications was not found');
    });

    test('User cannot create a crosslink involving a publication that is not live', async () => {
        const addCrossLink = await testUtils.agent
            .post('/crosslinks')
            .query({ apiKey: '123456789' })
            .send({
                publications: ['publication-problem-live', 'publication-hypothesis-draft']
            });

        expect(addCrossLink.status).toEqual(400);
        expect(addCrossLink.body.message).toEqual('Both publications in a crosslink must be published');
    });

    test('User must send 2 publication IDs', async () => {
        const addCrossLinkA = await testUtils.agent
            .post('/crosslinks')
            .query({ apiKey: '123456789' })
            .send({
                publications: ['publication-problem-live']
            });

        expect(addCrossLinkA.status).toEqual(422);
        expect(addCrossLinkA.body.message[0].keyword).toEqual('minItems');

        const addCrossLinkB = await testUtils.agent
            .post('/crosslinks')
            .query({ apiKey: '123456789' })
            .send({
                publications: ['publication-problem-live', 'publication-hypothesis-live', 'publication-data-live']
            });

        expect(addCrossLinkB.status).toEqual(422);
        expect(addCrossLinkB.body.message[0].keyword).toEqual('maxItems');
    });

    test('User cannot send two identical publication IDs', async () => {
        const addCrossLink = await testUtils.agent
            .post('/crosslinks')
            .query({ apiKey: '123456789' })
            .send({
                publications: ['publication-problem-live', 'publication-problem-live']
            });

        expect(addCrossLink.status).toEqual(422);
        expect(addCrossLink.body.message[0].keyword).toEqual('uniqueItems');
    });

    test('Anonymous user cannot create a crosslink', async () => {
        const addCrossLink = await testUtils.agent.post('/crosslinks').send({
            publications: ['publication-problem-live', 'publication-data-live']
        });

        expect(addCrossLink.status).toEqual(401);
    });
});
