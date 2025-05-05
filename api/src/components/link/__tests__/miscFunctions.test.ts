import * as client from 'lib/client';
import * as linkService from 'link/service';
import * as testUtils from 'lib/testUtils';

describe('Removing invalid links for a publication', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    // Links between drafts become invalid when the corresponding author on publication "from"
    // is not a co-author on publication "to".
    test('Function removes invalid links to a publication', async () => {
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

        await linkService.removeInvalidLinksForPublication('publication-protocol-draft', 'to');

        const linkCountAfter = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountAfter).toEqual(0);
    });

    test('Function removes invalid links from a publication', async () => {
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

        await linkService.removeInvalidLinksForPublication('publication-data-draft', 'from');

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

        await linkService.removeInvalidLinksForPublication('publication-protocol-draft', 'to');

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
        expect(linkCountBefore).toBeGreaterThan(0);

        await linkService.removeInvalidLinksForPublication('publication-problem-live-2', 'to');

        const linkCountAfter = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountAfter).toEqual(linkCountBefore);
    });

    test('Locked "from" publication is unlocked if no links remain', async () => {
        // A valid link exists between publication-problem-locked-2 and publication-problem-draft.
        const queryCondition = {
            publicationToId: 'publication-problem-draft',
            publicationFromId: 'publication-problem-locked-2',
            draft: true
        };
        const linkCountBefore = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountBefore).toEqual(1);

        // Make it invalid by deleting corresponding author of problem-locked-2 from problem-draft's co-authors.
        await client.prisma.coAuthors.delete({
            where: {
                id: 'coauthor-test-user-5-problem-draft'
            }
        });

        // Get co-author details before the change to compare to later.
        const coAuthorsBefore = await client.prisma.coAuthors.findMany({
            where: {
                publicationVersion: {
                    versionOf: 'publication-problem-locked-2',
                    isLatestVersion: true
                }
            },
            select: {
                id: true,
                code: true
            }
        });

        // Remove invalid links to publication-problem-draft.
        await linkService.removeInvalidLinksForPublication('publication-problem-draft', 'to');

        const linkCountAfter = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountAfter).toEqual(0);

        const fromVersion = await client.prisma.publicationVersion.findFirst({
            where: {
                versionOf: 'publication-problem-locked-2',
                isLatestVersion: true
            },
            select: {
                currentStatus: true,
                coAuthors: {
                    select: {
                        id: true,
                        code: true,
                        confirmedCoAuthor: true,
                        linkedUser: true,
                        retainApproval: true
                    }
                },
                createdBy: true
            }
        });

        if (!fromVersion) {
            fail('Publication version not found.');
        }

        // Expect the publication to be unlocked.
        expect(fromVersion.currentStatus).toEqual('DRAFT');

        // Expect co-authors to be reset if they do not have approval retention set.
        for (const coAuthor of fromVersion.coAuthors) {
            if (coAuthor.linkedUser !== fromVersion.createdBy && coAuthor.retainApproval === false) {
                expect(coAuthor.confirmedCoAuthor).toEqual(false);
                const coAuthorBefore = coAuthorsBefore.find((coAuthorBefore) => coAuthorBefore.id === coAuthor.id);
                expect(coAuthorBefore).toBeDefined();
                expect(coAuthorBefore?.code).not.toEqual(coAuthor.code);
            }
        }

        // Expect email to have been sent to corresponding author informing them of the unlocking.
        const searchMail = await testUtils.getEmails('test-user-5@jisc.ac.uk');
        expect(searchMail.messages[0].Subject).toEqual('Your publication has been unlocked due to another change');
    });

    test('Locked "from" publication remains locked if links remain', async () => {
        // A valid link exists between publication-problem-locked-1 and publication-problem-draft.
        const queryCondition = {
            publicationFromId: 'publication-problem-locked-1',
            draft: true
        };
        const linkCountBefore = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountBefore).toEqual(2);

        // Make it invalid by deleting corresponding author of problem-locked from problem-draft's co-authors.
        await client.prisma.coAuthors.delete({
            where: {
                id: 'coauthor-test-user-5-problem-draft'
            }
        });

        const coAuthorsBefore = await client.prisma.coAuthors.findMany({
            where: {
                publicationVersion: {
                    versionOf: 'publication-problem-locked-1',
                    isLatestVersion: true
                }
            },
            select: {
                id: true,
                code: true,
                confirmedCoAuthor: true
            }
        });

        // Remove invalid links to publication-problem-draft.
        await linkService.removeInvalidLinksForPublication('publication-problem-draft', 'to');

        const linkCountAfter = await client.prisma.links.count({
            where: queryCondition
        });
        expect(linkCountAfter).toEqual(1);

        const fromVersion = await client.prisma.publicationVersion.findFirst({
            where: {
                versionOf: 'publication-problem-locked-1',
                isLatestVersion: true
            },
            select: {
                currentStatus: true,
                coAuthors: {
                    select: {
                        id: true,
                        code: true,
                        confirmedCoAuthor: true
                    }
                }
            }
        });

        if (!fromVersion) {
            fail('Publication version not found.');
        }

        // Expect the publication to be locked.
        expect(fromVersion.currentStatus).toEqual('LOCKED');

        // Expect co-authors not to be reset.
        for (const coAuthor of fromVersion.coAuthors) {
            const coAuthorBefore = coAuthorsBefore.find((coAuthorBefore) => coAuthorBefore.id === coAuthor.id);
            expect(coAuthorBefore).toBeDefined();
            expect(coAuthorBefore?.code).toEqual(coAuthor.code);
            expect(coAuthorBefore?.confirmedCoAuthor).toEqual(coAuthor.confirmedCoAuthor);
        }
    });
});
