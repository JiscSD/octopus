import * as testUtils from 'lib/testUtils';

describe('delete a reference', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can delete a reference from their own draft publication', async () => {
        const reference = await testUtils.agent
            .delete('/publications/publication-interpretation-draft/reference/01')
            .query({ apiKey: '123456789' });

        expect(reference.status).toEqual(200);
    });

    test('User must be the author of the publication', async () => {
        const reference = await testUtils.agent
            .delete('/publications/publication-interpretation-draft/reference/01')
            .query({ apiKey: '987654321' });

        expect(reference.status).toEqual(403);
    });

    test('The author can only delete references from a live publication', async () => {
        const reference = await testUtils.agent
            .delete('/publications/publication-real-world-application-live/reference/03')
            .query({ apiKey: '123456789' });

        expect(reference.status).toEqual(403);
    });
});
