import * as testUtils from 'lib/testUtils';
import * as client from 'lib/client';

describe('Delete publications', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can delete their own DRAFT publication', async () => {
        const getPublication = await testUtils.agent.delete('/versions/publication-problem-draft-v1').query({
            apiKey: '000000005'
        });

        expect(getPublication.status).toEqual(200);

        const checkForPublication = await client.prisma.publication.count({
            where: {
                id: 'publication-problem-draft'
            }
        });

        expect(checkForPublication).toEqual(0);
    });

    test('User cannot delete their own LIVE publication', async () => {
        const getPublication = await testUtils.agent.delete('/versions/publication-problem-live-v1').query({
            apiKey: '123456789'
        });

        expect(getPublication.status).toEqual(403);

        const checkForPublication = await client.prisma.publication.count({
            where: {
                id: 'publication-problem-live'
            }
        });

        expect(checkForPublication).toEqual(1);
    });

    test('User cannot delete a DRAFT publication they did not create', async () => {
        const getPublication = await testUtils.agent.delete('/versions/publication-problem-draft-v1').query({
            apiKey: '987654321'
        });

        expect(getPublication.status).toEqual(403);
    });

    test('User cannot delete a LIVE publication they did not create', async () => {
        const getPublication = await testUtils.agent.delete('/versions/publication-problem-live-v1').query({
            apiKey: '987654321'
        });

        expect(getPublication.status).toEqual(403);
    });

    test('Unauthenticated user cannot delete a DRAFT publication they did not create', async () => {
        const getPublication = await testUtils.agent.delete('/versions/publication-problem-draft-v1');

        expect(getPublication.status).toEqual(401);
    });
});
