import * as testUtils from 'lib/testUtils';

describe('Edit a publication bundle', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Authenticated user can edit a publication bundle', async () => {
        const editRequest = await testUtils.agent
            .patch('/publication-bundles/test-bundle')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: 'Edited name',
                publicationIds: ['publication-hypothesis-live', 'publication-protocol-live', 'publication-data-live']
            });

        expect(editRequest.status).toBe(200);
        const expectedBundle = {
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            createdBy: 'test-user-1',
            name: 'Edited name',
            entries: [
                {
                    id: expect.any(String),
                    position: 0,
                    publicationId: 'publication-hypothesis-live',
                    publication: { id: 'publication-hypothesis-live' }
                },
                {
                    id: expect.any(String),
                    position: 1,
                    publicationId: 'publication-protocol-live',
                    publication: { id: 'publication-protocol-live' }
                },
                {
                    id: expect.any(String),
                    position: 2,
                    publicationId: 'publication-data-live',
                    publication: { id: 'publication-data-live' }
                }
            ]
        };

        expect(editRequest.body).toMatchObject(expectedBundle);
    });

    test('Unauthenticated user cannot create a publication bundle', async () => {
        const editRequest = await testUtils.agent.patch('/publication-bundles/test-bundle').send({
            name: 'Test Bundle',
            publicationIds: ['publication-problem-live', 'publication-problem-live-2']
        });
        expect(editRequest.status).toBe(401);
        expect(editRequest.body.message).toBe('Please enter either a valid apiKey or bearer token.');
    });

    test('Authenticated user cannot edit a non-existent publication bundle', async () => {
        const editRequest = await testUtils.agent
            .patch('/publication-bundles/made-up-bundle')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: 'Edited name',
                publicationIds: ['publication-hypothesis-live', 'publication-protocol-live', 'publication-data-live']
            });
        expect(editRequest.status).toBe(404);
        expect(editRequest.body.message).toBe('Publication bundle not found.');
    });

    test("Authenticated user cannot edit another user's publication bundle", async () => {
        const editRequest = await testUtils.agent
            .patch('/publication-bundles/test-bundle')
            .query({
                apiKey: '987654321'
            })
            .send({
                name: 'Edited name',
                publicationIds: ['publication-hypothesis-live', 'publication-protocol-live', 'publication-data-live']
            });
        expect(editRequest.status).toBe(403);
        expect(editRequest.body.message).toBe('You do not have permission to edit this publication bundle.');
    });

    test('Fields are not mandatory', async () => {
        const editRequest = await testUtils.agent
            .patch('/publication-bundles/test-bundle')
            .query({
                apiKey: '123456789'
            })
            .send({});
        expect(editRequest.status).toBe(200);
        // Expect unchanged bundle
        const expectedBundle = {
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            createdBy: 'test-user-1',
            name: 'Test Bundle',
            entries: [
                {
                    id: 'test-entry-1',
                    position: 0,
                    publicationId: 'publication-problem-live',
                    publication: { id: 'publication-problem-live' }
                },
                {
                    id: 'test-entry-2',
                    position: 1,
                    publicationId: 'publication-problem-live-2',
                    publication: { id: 'publication-problem-live-2' }
                }
            ]
        };
        expect(editRequest.body).toMatchObject(expectedBundle);
    });

    test('Name must not be empty if supplied', async () => {
        const editRequest = await testUtils.agent
            .patch('/publication-bundles/test-bundle')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: '',
                publicationIds: ['publication-problem-live', 'publication-problem-live-2']
            });
        expect(editRequest.status).toBe(400);
        expect(editRequest.body.message[0]).toMatchObject({
            instancePath: '/name',
            message: 'must NOT have fewer than 1 characters'
        });
    });

    test('Cannot supply fewer than 2 publication IDs if any supplied', async () => {
        const editRequest = await testUtils.agent
            .patch('/publication-bundles/test-bundle')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: 'Test Bundle',
                publicationIds: ['publication-problem-live']
            });
        expect(editRequest.status).toBe(400);
        expect(editRequest.body.message[0]).toMatchObject({
            instancePath: '/publicationIds',
            message: 'must NOT have fewer than 2 items'
        });
    });

    test('Cannot supply more than 30 publication IDs if any supplied', async () => {
        const editRequest = await testUtils.agent
            .patch('/publication-bundles/test-bundle')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: 'Test Bundle',
                publicationIds: [...Array(31).map((_, i) => `publication-problem-live-${i}`)]
            });
        expect(editRequest.status).toBe(400);
        expect(editRequest.body.message[0]).toMatchObject({
            instancePath: '/publicationIds',
            message: 'must NOT have more than 30 items'
        });
    });

    test('Publication IDs must be unique', async () => {
        const editRequest = await testUtils.agent
            .patch('/publication-bundles/test-bundle')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: 'Test Bundle',
                publicationIds: ['duplicate-id', 'duplicate-id']
            });
        expect(editRequest.status).toBe(400);
        expect(editRequest.body.message).toBe('Publication IDs must be unique.');
    });

    test('Non-existent publication IDs are rejected', async () => {
        const editRequest = await testUtils.agent
            .patch('/publication-bundles/test-bundle')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: 'Test Bundle',
                publicationIds: ['publication-problem-live', 'non-existent-id']
            });
        expect(editRequest.status).toBe(400);
        expect(editRequest.body.message).toBe('No live publications exist with the following IDs: non-existent-id');
    });

    test('All publication IDs must refer to live publications', async () => {
        const editRequest = await testUtils.agent
            .patch('/publication-bundles/test-bundle')
            .query({
                apiKey: '123456789'
            })
            .send({
                name: 'Test Bundle',
                publicationIds: ['publication-problem-live', 'publication-problem-draft']
            });
        expect(editRequest.status).toBe(400);
        expect(editRequest.body.message).toBe(
            'No live publications exist with the following IDs: publication-problem-draft'
        );
    });
});
