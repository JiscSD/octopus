import * as client from 'lib/client';
import * as testUtils from 'lib/testUtils';

describe('Delete a publication bundle', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Authenticated user can delete a publication bundle', async () => {
        const bundleId = 'test-bundle';
        const deleteRequest = await testUtils.agent.delete(`/publication-bundles/${bundleId}`).query({
            apiKey: '123456789'
        });

        expect(deleteRequest.status).toBe(200);
        expect(deleteRequest.body.message).toBe('Publication bundle deleted.');

        // Confirm bundle is deleted from DB
        const bundle = await client.prisma.publicationBundle.findUnique({
            where: { id: bundleId }
        });
        expect(bundle).toBeNull();
    });

    test('Unauthenticated user cannot create a publication bundle', async () => {
        const deleteRequest = await testUtils.agent.delete('/publication-bundles/test-bundle');
        expect(deleteRequest.status).toBe(401);
        expect(deleteRequest.body.message).toBe('Please enter either a valid apiKey or bearer token.');
    });

    test('Authenticated user cannot delete a non-existent publication bundle', async () => {
        const deleteRequest = await testUtils.agent.delete('/publication-bundles/made-up-bundle').query({
            apiKey: '123456789'
        });
        expect(deleteRequest.status).toBe(404);
        expect(deleteRequest.body.message).toBe('Publication bundle not found.');
    });

    test("Authenticated user cannot delete another user's publication bundle", async () => {
        const deleteRequest = await testUtils.agent.delete('/publication-bundles/test-bundle').query({
            apiKey: '987654321'
        });
        expect(deleteRequest.status).toBe(403);
        expect(deleteRequest.body.message).toBe('You do not have permission to delete this publication bundle.');
    });
});
