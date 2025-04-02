import * as client from 'lib/client';
import * as testUtils from 'lib/testUtils';
import * as eventService from 'event/service';

describe('Process request control events', () => {
    // 16 to be safe - if UTC to BST changes within this time frame, 15 may not be enough
    const sixteenDaysAgo = new Date();
    sixteenDaysAgo.setDate(sixteenDaysAgo.getDate() - 16);

    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Links made invalid by an ownership transfer are deleted', async () => {
        // Confirm that a link exists between the 2 draft publications.
        // test-user-1 is corresponding author on data-draft and co-author on protocol-draft.
        const queryCondition = {
            publicationToId: 'publication-protocol-draft',
            publicationFromId: 'publication-data-draft',
            draft: true
        };
        const linkCountBefore = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountBefore).toEqual(1);

        // Transfer ownership of publication-data-draft from test-user-1 to test-user-2 on publication-data-draft.
        await eventService.processRequestControlEvents([
            {
                id: 'test-control-request',
                createdAt: sixteenDaysAgo,
                type: 'REQUEST_CONTROL',
                data: {
                    requesterId: 'test-user-2',
                    publicationVersion: {
                        id: 'publication-data-draft-v1',
                        versionOf: 'publication-data-draft'
                    }
                }
            }
        ]);

        // Count links again.
        // test-user-2 does not have access to protocol-draft, so the link to it should be removed.
        const linkCountAfter = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountAfter).toEqual(0);
    });
});
