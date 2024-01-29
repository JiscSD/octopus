import * as testUtils from 'lib/testUtils';
import * as client from 'lib/client';

describe('Link co-author', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Can confirm publication involvement using authentication (and no code)', async () => {
        const link = await testUtils.agent
            .patch('/publication-versions/publication-hypothesis-draft-v1/link-coauthor')
            .query({ apiKey: '000000007' })
            .send({
                email: 'test-user-7@jisc.ac.uk',
                approve: true
            });
        expect(link.status).toEqual(200);

        const dbLink = await client.prisma.coAuthors.findFirst({
            where: { email: 'test-user-7@jisc.ac.uk', publicationVersionId: 'publication-hypothesis-draft-v1' }
        });

        expect(dbLink?.linkedUser).toEqual('test-user-7');
    });

    test('Can confirm involvement with a different email if code is provided', async () => {
        const link = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1/link-coauthor')
            .query({ apiKey: '123456789' }) // Test user 1
            .send({
                email: 'test-user-8@jisc.ac.uk',
                code: 'test-code-user-8',
                approve: true
            });

        expect(link.status).toEqual(200);

        // Email should be updated to that of the authenticated user.
        const dbLink = await client.prisma.coAuthors.findFirst({
            where: { code: 'test-code-user-8', publicationVersionId: 'publication-problem-draft-v1' }
        });
        expect(dbLink?.linkedUser).toEqual('test-user-1');
        expect(dbLink?.email).toEqual('test-user-1@jisc.ac.uk');
    });

    test('Cannot confirm involvement if no code is provided and user email does not match coauthor record', async () => {
        const link = await testUtils.agent
            .patch('/publication-versions/publication-hypothesis-draft-v1/link-coauthor')
            .query({ apiKey: '123456789' }) // Test user 1
            .send({
                email: 'test-user-7@jisc.ac.uk',
                approve: true
            });
        expect(link.status).toEqual(400);
        expect(link.body.message).toEqual(
            'To confirm or deny your involvement, you must either provide a code or be authenticated as a user with a verified email matching the co-author record.'
        );
    });

    test('Can deny publication involvement using authentication (and no code)', async () => {
        const link = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1/link-coauthor')
            .query({ apiKey: '000000007' })
            .send({
                email: 'test-user-7@jisc.ac.uk',
                approve: false
            });
        expect(link.status).toEqual(200);

        const dbLink = await client.prisma.coAuthors.findFirst({
            where: { email: 'test-user-7@jisc.ac.uk', publicationVersionId: 'publication-problem-draft-v1' }
        });

        expect(dbLink).toEqual(null);
    });

    test('Can deny publication involvement using a code (and no authentication)', async () => {
        const link = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1/link-coauthor')
            .send({
                email: 'test-user-7@jisc.ac.uk',
                code: 'test-code-user-7',
                approve: false
            });

        expect(link.status).toEqual(200);
    });

    test('Cannot confirm involvement if you are the creator', async () => {
        const link = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1/link-coauthor')
            .query({ apiKey: '000000005' })
            .send({
                email: 'test-user-7@jisc.ac.uk',
                code: 'test-code-user-7',
                approve: true
            });

        expect(link.status).toEqual(404);
    });

    test('Cannot confirm involvement if user has already been linked as another co-author', async () => {
        const link = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1/link-coauthor')
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
            .patch('/publication-versions/publication-problem-draft-v1/link-coauthor')
            .query({ apiKey: '987654321' })
            .send({
                email: 'test-user-6@jisc.ac.uk',
                code: 'test-code-user-6',
                approve: true
            });

        expect(link.status).toEqual(404);
        expect(link.body.message).toEqual('User has already been linked to this publication.');
    });
});
