import * as testUtils from 'lib/testUtils';

describe('delete an affiliation', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can delete an affiliation from a DRAFT publication', async () => {
        const affiliation = await testUtils.agent
            .delete('/publications/publication-problem-draft/affiliation/publication-problem-draft-affiliation')
            .query({ apiKey: '123456789' });

        expect(affiliation.status).toEqual(200);
    });

    test('User cannot delete an affiliation from a DRAFT publication they are not the owner of', async () => {
        const affiliation = await testUtils.agent
            .delete('/publications/publication-problem-draft/affiliation/publication-problem-draft-affiliation')
            .query({ apiKey: '987654321' });

        expect(affiliation.status).toEqual(403);
    });

    test('User cannot delete an affiliation from a LIVE publication', async () => {
        const affiliation = await testUtils.agent
            .delete('/publications/publication-problem-live/affiliation/publication-problem-live-affiliation')
            .query({ apiKey: '123456789' });

        expect(affiliation.status).toEqual(403);
    });
});
