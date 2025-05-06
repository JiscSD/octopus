import * as client from 'lib/client';
import * as testUtils from 'lib/testUtils';

describe('Mark links for deletion', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Links can be marked for deletion by the publication author', async () => {
        // Confirm state before change.
        const linkBefore = await client.prisma.links.findUnique({
            where: {
                id: 'multiversion-hypothesis-link-to-live'
            }
        });
        expect(linkBefore?.pendingDeletion).toBe(false);

        const markForDeletion = await testUtils.agent
            .post('/links/multiversion-hypothesis-link-to-live/mark-for-deletion')
            .query({
                apiKey: '000000005'
            })
            .send({
                toDelete: true
            });

        expect(markForDeletion.statusCode).toBe(200);
        expect(markForDeletion.body.message).toBe('Link marked for deletion.');

        // Confirm effect is as intended.
        const linkAfter = await client.prisma.links.findUnique({
            where: {
                id: 'multiversion-hypothesis-link-to-live'
            }
        });
        expect(linkAfter?.pendingDeletion).toBe(true);
    });

    test('Anonymous user cannot mark a link for deletion', async () => {
        const markForDeletion = await testUtils.agent
            .post('/links/multiversion-hypothesis-link-to-live/mark-for-deletion')
            .send({
                toDelete: true
            });

        expect(markForDeletion.statusCode).toBe(401);
    });

    test('Non-existent links cannot be marked for deletion', async () => {
        const markForDeletion = await testUtils.agent
            .post('/links/made-up-link/mark-for-deletion')
            .query({
                apiKey: '000000005'
            })
            .send({
                toDelete: true
            });

        expect(markForDeletion.statusCode).toBe(404);
        expect(markForDeletion.body.message).toBe('Link not found.');
    });

    test('User other than corresponding author cannot mark a link for deletion', async () => {
        const markForDeletion = await testUtils.agent
            .post('/links/multiversion-hypothesis-link-to-live/mark-for-deletion')
            .query({
                apiKey: '987654321'
            })
            .send({
                toDelete: true
            });

        expect(markForDeletion.statusCode).toBe(403);
        expect(markForDeletion.body.message).toBe('You do not have permission to mark this link for deletion.');
    });

    test('Draft links cannot be marked for deletion', async () => {
        const markForDeletion = await testUtils.agent
            .post('/links/multiversion-hypothesis-draft-link/mark-for-deletion')
            .query({
                apiKey: '000000005'
            })
            .send({
                toDelete: true
            });

        expect(markForDeletion.statusCode).toBe(400);
        expect(markForDeletion.body.message).toBe(
            'Draft links cannot be marked for deletion. You can simply delete them instead.'
        );
    });

    test('Link cannot be marked for deletion if there is no current draft', async () => {
        const markForDeletion = await testUtils.agent
            .post('/links/hypothesis-live-to-problem-live/mark-for-deletion')
            .query({
                apiKey: '123456789'
            })
            .send({
                toDelete: true
            });

        expect(markForDeletion.statusCode).toBe(400);
        expect(markForDeletion.body.message).toBe('This publication has no active draft. Please make one first.');
    });
});
