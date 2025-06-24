import { Prisma } from '@prisma/client';

import * as client from 'lib/client';
import * as testUtils from 'lib/testUtils';

describe('Delete links', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can delete a draft link where they own the fromPublication and it is DRAFT', async () => {
        const linkQuery: Prisma.LinksFindUniqueArgs = { where: { id: 'multiversion-hypothesis-draft-link' } };
        // Confirm link exists first.
        const link = await client.prisma.links.findUnique(linkQuery);
        expect(link).toMatchObject({
            id: 'multiversion-hypothesis-draft-link',
            draft: true
        });

        const deleteLink = await testUtils.agent.delete('/links/multiversion-hypothesis-draft-link').query({
            apiKey: '000000005'
        });
        expect(deleteLink.statusCode).toBe(200);
        expect(deleteLink.body.message).toBe('Link deleted.');

        const linkAfter = await client.prisma.links.findUnique(linkQuery);
        expect(linkAfter).toBeNull();
    });

    test('User cannot delete a link where they own the fromPublication and it is LIVE', async () => {
        const deleteLink = await testUtils.agent.delete('/links/hypothesis-live-to-problem-live').query({
            apiKey: '123456789'
        });
        expect(deleteLink.statusCode).toBe(400);
        expect(deleteLink.body.message).toBe(
            'A link can only be deleted if it has been made from a publication currently in draft state.'
        );
    });

    test('User cannot delete a link where they do not own the fromPublication and it is DRAFT', async () => {
        const deleteLink = await testUtils.agent.delete('/links/multiversion-hypothesis-draft-link').query({
            apiKey: '123456789'
        });
        expect(deleteLink.statusCode).toBe(403);
        expect(deleteLink.body.message).toBe('You do not have permission to delete this link');
    });

    test('User cannot delete a link where they do not own the fromPublication and it is LIVE', async () => {
        const deleteLink = await testUtils.agent.delete('/links/hypothesis-live-to-problem-live').query({
            apiKey: '000000005'
        });
        expect(deleteLink.statusCode).toBe(403);
        expect(deleteLink.body.message).toBe('You do not have permission to delete this link');
    });

    test('Unauthenticated user cannot delete a link where they do not own the fromPublication and it is DRAFT', async () => {
        const deleteLink = await testUtils.agent.delete('/links/multiversion-hypothesis-draft-link');
        expect(deleteLink.statusCode).toBe(401);
    });

    test('User cannot delete a link inherited from a previous version', async () => {
        const deleteLink = await testUtils.agent.delete('/links/multiversion-hypothesis-link-to-live').query({
            apiKey: '000000005'
        });
        expect(deleteLink.statusCode).toBe(403);
        expect(deleteLink.body.message).toBe('You are not allowed to delete inherited links.');
    });

    test('Non-existent links return not found response', async () => {
        const deleteLink = await testUtils.agent.delete('/links/made-up-link').query({
            apiKey: '000000005'
        });
        expect(deleteLink.statusCode).toBe(404);
        expect(deleteLink.body.message).toBe('Link not found.');
    });
});
