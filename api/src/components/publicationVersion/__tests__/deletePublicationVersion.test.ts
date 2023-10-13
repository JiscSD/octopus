import * as testUtils from 'lib/testUtils';
import * as client from 'lib/client';

describe('Delete publication versions', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can delete their own DRAFT publication version', async () => {
        const deletePublicationVersion = await testUtils.agent
            .delete('/publication-versions/publication-problem-draft-v1')
            .query({
                apiKey: '000000005'
            });

        expect(deletePublicationVersion.status).toEqual(200);

        const checkForPublicationVersion = await client.prisma.publication.count({
            where: {
                id: 'publication-problem-draft'
            }
        });

        expect(checkForPublicationVersion).toEqual(0);
    });

    test('User cannot delete their own LIVE publication version', async () => {
        const deletePublicationVersion = await testUtils.agent
            .delete('/publication-versions/publication-problem-live-v1')
            .query({
                apiKey: '123456789'
            });

        expect(deletePublicationVersion.status).toEqual(403);

        const checkForPublicationVersion = await client.prisma.publication.count({
            where: {
                id: 'publication-problem-live'
            }
        });

        expect(checkForPublicationVersion).toEqual(1);
    });

    test('User cannot delete a DRAFT publication version they did not create', async () => {
        const deletePublicationVersion = await testUtils.agent
            .delete('/publication-versions/publication-problem-draft-v1')
            .query({
                apiKey: '987654321'
            });

        expect(deletePublicationVersion.status).toEqual(403);
    });

    test('User cannot delete a LIVE publication version they did not create', async () => {
        const deletePublicationVersion = await testUtils.agent
            .delete('/publication-versions/publication-problem-live-v1')
            .query({
                apiKey: '987654321'
            });

        expect(deletePublicationVersion.status).toEqual(403);
    });

    test('Unauthenticated user cannot delete a DRAFT publication version they did not create', async () => {
        const deletePublicationVersion = await testUtils.agent.delete(
            '/publication-versions/publication-problem-draft-v1'
        );

        expect(deletePublicationVersion.status).toEqual(401);
    });
});
