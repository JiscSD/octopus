import * as testUtils from 'lib/testUtils';

describe('Create a publication bundle', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Authenticated user can create a publication bundle', async () => {
        const createRequest = await testUtils.agent
            .post('/publication-bundles')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: 'Test Bundle',
                publicationIds: ['publication-problem-live', 'publication-problem-live-2']
            });

        expect(createRequest.status).toBe(201);
        const expectedBundle = {
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            createdBy: 'test-user-1',
            name: 'Test Bundle',
            entries: [
                {
                    id: expect.any(String),
                    position: 0,
                    publicationId: 'publication-problem-live',
                    publication: { id: 'publication-problem-live' }
                },
                {
                    id: expect.any(String),
                    position: 1,
                    publicationId: 'publication-problem-live-2',
                    publication: { id: 'publication-problem-live-2' }
                }
            ]
        };
        expect(createRequest.body).toMatchObject(expectedBundle);
    });

    test('Unauthenticated user cannot create a publication bundle', async () => {
        const createRequest = await testUtils.agent.post('/publication-bundles').send({
            name: 'Test Bundle',
            publicationIds: ['publication-problem-live', 'publication-problem-live-2']
        });
        expect(createRequest.status).toBe(401);
        expect(createRequest.body.message).toBe('Please enter either a valid apiKey or bearer token.');
    });

    test('Name is mandatory', async () => {
        const createRequest = await testUtils.agent
            .post('/publication-bundles')
            .query({
                apiKey: '123456789'
            })
            .send({
                publicationIds: ['publication-problem-live', 'publication-problem-live-2']
            });
        expect(createRequest.status).toBe(400);
        expect(createRequest.body.message[0].message).toBe("must have required property 'name'");
    });

    test('Name must not be empty', async () => {
        const createRequest = await testUtils.agent
            .post('/publication-bundles')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: '',
                publicationIds: ['publication-problem-live', 'publication-problem-live-2']
            });
        expect(createRequest.status).toBe(400);
        expect(createRequest.body.message[0]).toMatchObject({
            instancePath: '/name',
            message: 'must NOT have fewer than 1 characters'
        });
    });

    test('Publication IDs are mandatory', async () => {
        const createRequest = await testUtils.agent
            .post('/publication-bundles')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: 'Test Bundle'
            });
        expect(createRequest.status).toBe(400);
        expect(createRequest.body.message[0].message).toBe("must have required property 'publicationIds'");
    });

    test('Cannot supply fewer than 2 publication IDs', async () => {
        const createRequest = await testUtils.agent
            .post('/publication-bundles')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: 'Test Bundle',
                publicationIds: ['publication-problem-live']
            });
        expect(createRequest.status).toBe(400);
        expect(createRequest.body.message[0]).toMatchObject({
            instancePath: '/publicationIds',
            message: 'must NOT have fewer than 2 items'
        });
    });

    test('Cannot supply more than 30 publication IDs', async () => {
        const createRequest = await testUtils.agent
            .post('/publication-bundles')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: 'Test Bundle',
                publicationIds: [...Array(31).map((_, i) => `publication-problem-live-${i}`)]
            });
        expect(createRequest.status).toBe(400);
        expect(createRequest.body.message[0]).toMatchObject({
            instancePath: '/publicationIds',
            message: 'must NOT have more than 30 items'
        });
    });

    test('Publication IDs must be unique', async () => {
        const createRequest = await testUtils.agent
            .post('/publication-bundles')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: 'Test Bundle',
                publicationIds: ['duplicate-id', 'duplicate-id']
            });
        expect(createRequest.status).toBe(400);
        expect(createRequest.body.message).toBe('Publication IDs must be unique.');
    });

    test('Non-existent publication IDs are rejected', async () => {
        const createRequest = await testUtils.agent
            .post('/publication-bundles')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: 'Test Bundle',
                publicationIds: ['publication-problem-live', 'non-existent-id']
            });
        expect(createRequest.status).toBe(400);
        expect(createRequest.body.message).toBe('No live publications exist with the following IDs: non-existent-id');
    });

    test('All publication IDs must refer to live publications', async () => {
        const createRequest = await testUtils.agent
            .post('/publication-bundles')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: 'Test Bundle',
                publicationIds: ['publication-problem-live', 'publication-problem-draft']
            });
        expect(createRequest.status).toBe(400);
        expect(createRequest.body.message).toBe(
            'No live publications exist with the following IDs: publication-problem-draft'
        );
    });
});
