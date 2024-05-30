import * as client from 'lib/client';
import * as testUtils from 'lib/testUtils';

describe('Create a crosslink', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can add a crosslink between two publications', async () => {
        const addCrosslink = await testUtils.agent
            .post('/crosslinks')
            .query({ apiKey: '123456789' })
            .send({
                publications: ['publication-problem-live', 'organisational-account-publication-1']
            });

        expect(addCrosslink.status).toEqual(200);

        // Check that an up vote has been automatically created on the new crosslink
        const checkVote = await client.prisma.crosslinkVote.findUnique({
            where: {
                crosslinkId_createdBy: {
                    crosslinkId: addCrosslink.body.id,
                    createdBy: 'test-user-1'
                }
            }
        });
        expect(checkVote?.vote).toEqual(true);
    });

    test('User cannot add a crosslink between two publications that are already crosslinked', async () => {
        const addCrosslink = await testUtils.agent
            .post('/crosslinks')
            .query({ apiKey: '123456789' })
            .send({
                publications: ['publication-problem-live', 'publication-problem-live-2']
            });

        expect(addCrosslink.status).toEqual(400);
        expect(addCrosslink.body.message).toEqual('A crosslink already exists between these publications.');
    });

    test('User cannot create a crosslink involving an invalid publication ID', async () => {
        const addCrosslink = await testUtils.agent
            .post('/crosslinks')
            .query({ apiKey: '123456789' })
            .send({
                publications: ['publication-problem-live', 'made-up-id']
            });

        expect(addCrosslink.status).toEqual(404);
        expect(addCrosslink.body.message).toEqual('One or both of the publications was not found.');
    });

    test('User cannot create a crosslink involving a publication that is not live', async () => {
        const addCrosslink = await testUtils.agent
            .post('/crosslinks')
            .query({ apiKey: '123456789' })
            .send({
                publications: ['publication-problem-live', 'publication-problem-draft']
            });

        expect(addCrosslink.status).toEqual(400);
        expect(addCrosslink.body.message).toEqual('Both publications in a crosslink must be published.');
    });

    test('User must send 2 publication IDs', async () => {
        const addCrosslinkA = await testUtils.agent
            .post('/crosslinks')
            .query({ apiKey: '123456789' })
            .send({
                publications: ['publication-problem-live']
            });

        expect(addCrosslinkA.status).toEqual(400);
        expect(addCrosslinkA.body.message[0].keyword).toEqual('minItems');

        const addCrosslinkB = await testUtils.agent
            .post('/crosslinks')
            .query({ apiKey: '123456789' })
            .send({
                publications: [
                    'publication-problem-live',
                    'organisational-account-publication-1',
                    'publication-problem-draft'
                ]
            });

        expect(addCrosslinkB.status).toEqual(400);
        expect(addCrosslinkB.body.message[0].keyword).toEqual('maxItems');
    });

    test('User cannot send two identical publication IDs', async () => {
        const addCrosslink = await testUtils.agent
            .post('/crosslinks')
            .query({ apiKey: '123456789' })
            .send({
                publications: ['publication-problem-live', 'publication-problem-live']
            });

        expect(addCrosslink.status).toEqual(400);
        expect(addCrosslink.body.message[0].keyword).toEqual('uniqueItems');
    });

    test('Anonymous user cannot create a crosslink', async () => {
        const addCrosslink = await testUtils.agent.post('/crosslinks').send({
            publications: ['publication-problem-live', 'organisational-account-publication-1']
        });

        expect(addCrosslink.status).toEqual(401);
    });

    test('Crosslinks cannot be created between publications of a different type', async () => {
        const addCrosslink = await testUtils.agent
            .post('/crosslinks')
            .send({
                publications: ['publication-problem-live', 'publication-hypothesis-live']
            })
            .query({ apiKey: '123456789' });

        expect(addCrosslink.status).toEqual(400);
        expect(addCrosslink.body.message).toEqual('Crosslinks must be between publications of the same type.');
    });
});
