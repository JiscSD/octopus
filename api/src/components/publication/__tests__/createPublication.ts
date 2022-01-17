import * as testUtils from 'lib/testUtils';
// import prisma from 'lib/client';

beforeEach(async () => {
    await testUtils.clearDB();
    await testUtils.initialSeed();
});

describe('Create publication', () => {
    test('Valid publication created by real user, status is correct too (200)', async () => {
        const createPublicationRequest = await testUtils.agent.post('/publications').query({
            apiKey: '123456789'
        }).send({
            type: 'PEER_REVIEW',
            title: 'Publication test 1'
        });

        expect(createPublicationRequest.status).toEqual(200);

        expect(createPublicationRequest.body.user.id).toEqual('test-user-1');
        expect(createPublicationRequest.body.publicationStatus.length).toEqual(1);
        expect(createPublicationRequest.body.publicationStatus[0].status).toEqual('DRAFT');
    });

    test('Valid publication created by real user with content (200)', async () => {
        const createPublicationRequest = await testUtils.agent.post('/publications').query({
            apiKey: '123456789'
        }).send({
            type: 'PEER_REVIEW',
            title: 'Publication test 2',
            content: 'Content'
        });

        expect(createPublicationRequest.status).toEqual(200);
    });

    test('Valid publication not created by user that does not exist (401)', async () => {
        const createPublicationRequest = await testUtils.agent.post('/publications').query({
            apiKey: '123'
        }).send({
            type: 'PEER_REVIEW',
            title: 'Publication test 3'
        });

        expect(createPublicationRequest.status).toEqual(401);
    });

    test('Invalid publication type, created by user that does exist (422)', async () => {
        const createPublicationRequest = await testUtils.agent.post('/publications').query({
            apiKey: '123456789'
        }).send({
            type: 'NOT_REAL',
            title: 'Publication test 4'
        });

        expect(createPublicationRequest.status).toEqual(422);
    });

    test('Attempt to create publication with no title, created by user that does exist (422)', async () => {
        const createPublicationRequest = await testUtils.agent.post('/publications').query({
            apiKey: '123456789'
        }).send({
            type: 'PEER_REVIEW',
            content: 'Content'
        });

        expect(createPublicationRequest.status).toEqual(422);
    });

    test('Attempt to create publication with no title, content or type, created by user that does exist (422)', async () => {
        const createPublicationRequest = await testUtils.agent.post('/publications').query({
            apiKey: '123456789'
        }).send({});

        expect(createPublicationRequest.status).toEqual(422);
    });

    test('Attempt to create publication with added invalid properties, created by user that does exist (422)', async () => {
        const createPublicationRequest = await testUtils.agent.post('/publications').query({
            apiKey: '123456789'
        }).send({
            title: 'Example',
            type: 'PEER_REVIEW',
            content: 'Content',
            keyDoesNotExist: 'This should return a 422'
        });

        expect(createPublicationRequest.status).toEqual(422);
    });
});