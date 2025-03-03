import * as client from 'lib/client';
import * as linkService from 'link/service';
import * as testUtils from 'lib/testUtils';

describe('Removing invalid links', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    // Links between drafts become invalid when the corresponding author on publication "from"
    // is not a co-author on publication "to".
    test('Function removes invalid links between drafts', async () => {
        // A valid link exists between publication-data-draft and publication-protocol-draft.
        const queryCondition = {
            publicationToId: 'publication-protocol-draft',
            publicationFromId: 'publication-data-draft',
            draft: true
        };
        const linkCountBefore = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountBefore).toEqual(1);

        // Make it invalid by deleting corresponding author of data-draft from protocol-draft's co-authors.
        await client.prisma.coAuthors.delete({
            where: {
                id: 'coauthor-test-user-1-protocol-draft'
            }
        });

        await linkService.removeInvalidLinksToPublication('publication-protocol-draft');

        const linkCountAfter = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountAfter).toEqual(0);
    });

    test('Function does not remove valid links between drafts', async () => {
        const queryCondition = {
            publicationToId: 'publication-protocol-draft',
            publicationFromId: 'publication-data-draft',
            draft: true
        };
        const linkCountBefore = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountBefore).toEqual(1);

        await linkService.removeInvalidLinksToPublication('publication-protocol-draft');

        const linkCountAfter = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountAfter).toEqual(1);
    });

    test('Function does not remove other valid links', async () => {
        const queryCondition = {
            publicationToId: 'publication-problem-live-2'
        };
        const linkCountBefore = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountBefore).toEqual(3);

        await linkService.removeInvalidLinksToPublication('publication-problem-live-2');

        const linkCountAfter = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountAfter).toEqual(3);
    });
});
