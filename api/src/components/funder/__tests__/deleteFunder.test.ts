import * as testUtils from 'lib/testUtils';

describe('delete a funder', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can delete a funder from a DRAFT publication version', async () => {
        const funder = await testUtils.agent
            .delete('/versions/publication-problem-draft-v1/funders/publication-problem-draft-funder')
            .query({ apiKey: '000000005' });

        expect(funder.status).toEqual(200);
    });

    test('User cannot delete a funder from a DRAFT publication version they are not the owner of', async () => {
        const funder = await testUtils.agent
            .delete('/versions/publication-problem-draft-v1/funders/publication-problem-draft-funder')
            .query({ apiKey: '987654321' });

        expect(funder.status).toEqual(403);
    });

    test('User cannot delete a funder from a LIVE publication', async () => {
        const funder = await testUtils.agent
            .delete('/versions/publication-problem-live-v1/funders/publication-problem-live-funder')
            .query({ apiKey: '123456789' });

        expect(funder.status).toEqual(403);
    });
});
