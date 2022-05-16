import * as testUtils from 'lib/testUtils';

describe('delete a funder', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('User can delete a funder from a DRAFT publication', async () => {
        const funder = await testUtils.agent
            .delete('/publications/publication-problem-draft/funders/publication-problem-draft-funder')
            .query({ apiKey: '123456789' });

        expect(funder.status).toEqual(200);
    });

    test('User cannot delete a funder from a DRAFT publication they are not the owner of', async () => {
        const funder = await testUtils.agent
            .delete('/publications/publication-problem-draft/funders/publication-problem-draft-funder')
            .query({ apiKey: '987654321' });

        expect(funder.status).toEqual(403);
    });

    test('User cannot delete a funder from a LIVE publication', async () => {
        const funder = await testUtils.agent
            .delete('/publications/publication-problem-live/funders/publication-problem-live-funder')
            .query({ apiKey: '123456789' });

        expect(funder.status).toEqual(403);
    });
});
