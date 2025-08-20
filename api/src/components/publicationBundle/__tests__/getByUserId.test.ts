import * as testUtils from 'lib/testUtils';

describe('Get your own publication bundles', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Authenticated user can get their own publication bundles', async () => {
        const getRequest = await testUtils.agent.get('/publication-bundles').query({
            apiKey: '123456789'
        });

        expect(getRequest.status).toBe(200);
        expect(getRequest.body).toMatchObject({
            metadata: {
                total: 2,
                limit: 10,
                offset: 0
            },
            data: [
                {
                    id: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    createdBy: 'test-user-1',
                    name: 'Test Bundle',
                    entries: [
                        {
                            id: 'test-entry-2',
                            position: 1,
                            publicationId: 'publication-problem-live-2'
                        },
                        {
                            id: 'test-entry-1',
                            position: 0,
                            publicationId: 'publication-problem-live'
                        }
                    ]
                },
                {
                    id: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    createdBy: 'test-user-1',
                    name: 'Test Bundle 2',
                    entries: [
                        {
                            id: 'test-entry-4',
                            position: 1,
                            publicationId: 'publication-protocol-live'
                        },
                        {
                            id: 'test-entry-3',
                            position: 0,
                            publicationId: 'publication-hypothesis-live'
                        }
                    ]
                }
            ]
        });
    });

    test('Non-authenticated user cannot get publication bundles', async () => {
        const getRequest = await testUtils.agent.get('/publication-bundles');
        expect(getRequest.status).toBe(401);
        expect(getRequest.body.message).toBe('Please enter either a valid apiKey or bearer token.');
    });

    test('Results can be limited', async () => {
        const getRequest = await testUtils.agent.get('/publication-bundles').query({
            apiKey: '123456789',
            limit: 1
        });
        expect(getRequest.status).toBe(200);
        expect(getRequest.body.metadata).toMatchObject({
            total: 2,
            limit: 1,
            offset: 0
        });
        expect(getRequest.body.data).toHaveLength(1);
    });

    test('Results can be offset', async () => {
        const getRequest = await testUtils.agent.get('/publication-bundles').query({
            apiKey: '123456789',
            offset: 1
        });
        expect(getRequest.status).toBe(200);
        expect(getRequest.body.metadata).toMatchObject({
            total: 2,
            limit: 10,
            offset: 1
        });
        expect(getRequest.body.data).toHaveLength(1);
        expect(getRequest.body.data[0].name).toBe('Test Bundle 2');
    });
});
