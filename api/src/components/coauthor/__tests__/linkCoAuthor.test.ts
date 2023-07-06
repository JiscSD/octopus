import * as testUtils from 'lib/testUtils';
import * as client from 'lib/client';

describe('Link co-author', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Link a co-author to a publication (allow)', async () => {
        const link = await testUtils.agent
            .patch('/publications/publication-hypothesis-draft/link-coauthor')
            .query({ apiKey: '000000007' })
            .send({
                email: 'test-user-7@jisc.ac.uk',
                code: 'test-code-user-7',
                approve: true
            });
        expect(link.status).toEqual(200);

        const dbLink = await client.prisma.coAuthors.findFirst({
            where: { email: 'test-user-7@jisc.ac.uk', publicationId: 'publication-hypothesis-draft' }
        });

        expect(dbLink?.linkedUser).toEqual('test-user-7');
    });

    test('Link a co-author to a publication (do not allow) with authentication', async () => {
        const link = await testUtils.agent
            .patch('/publications/publication-problem-draft/link-coauthor')
            .query({ apiKey: '987654321' })
            .send({
                email: 'test-user-7@jisc.ac.uk',
                code: 'test-code-user-7',
                approve: false
            });
        expect(link.status).toEqual(200);

        const dbLink = await client.prisma.coAuthors.findFirst({
            where: { email: 'test-user-7@jisc.ac.uk', publicationId: 'publication-problem-draft' }
        });

        expect(dbLink).toEqual(null);
    });

    test('Link a co-author to a publication (do not allow) without authentication', async () => {
        const link = await testUtils.agent
            .patch('/publications/publication-problem-draft/link-coauthor')
            .query({ apiKey: '987654321' })
            .send({
                email: 'test-user-7@jisc.ac.uk',
                code: 'test-code-user-7',
                approve: false
            });

        expect(link.status).toEqual(200);
    });

    test('Cannot link as co-author if you are the creator', async () => {
        const link = await testUtils.agent
            .patch('/publications/publication-problem-draft/link-coauthor')
            .query({ apiKey: '000000005' })
            .send({
                email: 'test-user-7@jisc.ac.uk',
                code: 'test-code-user-7',
                approve: true
            });

        expect(link.status).toEqual(404);
    });

    test('Cannot link co-author if user has already been linked as another co-author', async () => {
        const link = await testUtils.agent
            .patch('/publications/publication-problem-draft/link-coauthor')
            .query({ apiKey: '000000006' })
            .send({
                email: 'test-user-6@jisc.ac.uk',
                code: 'test-code-user-6',
                approve: true
            });

        expect(link.status).toEqual(404);
    });

    test('Cannot override co-authorship', async () => {
        const link = await testUtils.agent
            .patch('/publications/publication-problem-draft/link-coauthor')
            .query({ apiKey: '987654321' })
            .send({
                email: 'test-user-6@jisc.ac.uk',
                code: 'test-code-user-6',
                approve: true
            });

        expect(link.status).toEqual(404);
    });

    // the following test covers an edge case, but still possible
    test('Cannot link co-author with a different email address', async () => {
        // trying to accept invitation with a user which is not a co-author
        const response = await testUtils.agent
            .patch('/publications/publication-problem-draft/link-coauthor')
            .query({ apiKey: '000000004' })
            .send({
                email: 'test-user-7@jisc.ac.uk',
                code: 'test-code-user-7',
                approve: true
            });

        expect(response.status).toEqual(404);
        expect(response.body.message).toBe('You are not currently listed as an author on this draft');

        // trying to accept invitation with a different co-author account
        const response2 = await testUtils.agent
            .patch('/publications/publication-problem-draft/link-coauthor')
            .query({ apiKey: '000000008' })
            .send({
                email: 'test-user-7@jisc.ac.uk',
                code: 'test-code-user-7',
                approve: true
            });

        expect(response2.status).toEqual(403);
        expect(response2.body.message).toBe(
            'Your email address does not match the one to which the invitation has been sent.'
        );
    });
});
