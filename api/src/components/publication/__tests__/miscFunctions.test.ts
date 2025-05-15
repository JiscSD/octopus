import * as publicationService from 'publication/service';
import * as testUtils from 'lib/testUtils';

describe('Check if a publication is live', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Returns true for a publication with a live version', async () => {
        const isLive = await publicationService.isLive('publication-problem-live');
        expect(isLive).toBe(true);
    });

    test('Returns false for a publication without a live version', async () => {
        const isLive = await publicationService.isLive('publication-problem-draft');
        expect(isLive).toBe(false);
    });

    test('Returns false for a non-existent publication', async () => {
        const isLive = await publicationService.isLive('non-existent-publication');
        expect(isLive).toBe(false);
    });
});
