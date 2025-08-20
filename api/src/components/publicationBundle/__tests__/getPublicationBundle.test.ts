import * as testUtils from 'lib/testUtils';

describe('Get a publication bundle', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Anonymous user can get a publication bundle', async () => {
        const getRequest = await testUtils.agent.get('/publication-bundles/test-bundle');

        expect(getRequest.status).toBe(200);
        expect(getRequest.body).toMatchObject({
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
        });
    });

    test('Non-existent bundle returns 404', async () => {
        const getRequest = await testUtils.agent.get('/publication-bundles/non-existent-bundle');
        expect(getRequest.status).toBe(404);
        expect(getRequest.body.message).toBe('Publication bundle not found.');
    });
});
