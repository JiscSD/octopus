import * as testUtils from 'lib/testUtils';
import * as client from 'lib/client';

describe('Link co-author', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    // At the moment "message": "To link yourself as a co-author, you must be logged in."
    test('Link a co-author to a publication (allow)', async () => {
        const link = await testUtils.agent
            .patch('/publications/publication-problem-draft/link-coauthor')
            .query({ apiKey: '000000005' })
            .send({
                email: 'testemail@test.com',
                code: 'test',
                approve: true
            });

        expect(link.status).toEqual(200);

        const dbLink = await client.prisma.coAuthors.findFirst({
            where: { email: 'testemail@test.com', publicationId: 'publication-problem-draft' }
        });

        expect(dbLink?.linkedUser).toEqual('test-user-2');
    });

    test('Link a co-author to a publication (do not allow) with authentication', async () => {
        const link = await testUtils.agent
            .patch('/publications/publication-problem-draft/link-coauthor')
            .query({ apiKey: '987654321' })
            .send({
                email: 'testemail@test.com',
                code: 'test',
                approve: false
            });

        expect(link.status).toEqual(200);

        const dbLink = await client.prisma.coAuthors.findFirst({
            where: { email: 'testemail@test.com', publicationId: 'publication-problem-draft' }
        });

        expect(dbLink).toEqual(null);
    });

    test('Link a co-author to a publication (do not allow) without authentication', async () => {
        const link = await testUtils.agent
            .patch('/publications/publication-problem-draft/link-coauthor')
            .query({ apiKey: '987654321' })
            .send({
                email: 'testemail@test.com',
                code: 'test',
                approve: false
            });

        expect(link.status).toEqual(200);
    });

    test('Cannot link as co-author if you are the creator', async () => {
        const link = await testUtils.agent
            .patch('/publications/publication-problem-draft/link-coauthor')
            .query({ apiKey: '000000005' })
            .send({
                email: 'testemail@test.com',
                code: 'test',
                approve: true
            });

        expect(link.status).toEqual(404);
    });

    test('Cannot link co-author if user has already been linked as another co-author', async () => {
        const link = await testUtils.agent
            .patch('/publications/publication-problem-draft/link-coauthor')
            .query({ apiKey: '1234' })
            .send({
                email: 'testemail@test.com',
                code: 'test',
                approve: true
            });

        expect(link.status).toEqual(404);
    });

    test('Cannot override co-authoriship', async () => {
        const link = await testUtils.agent
            .patch('/publications/publication-problem-draft/link-coauthor')
            .query({ apiKey: '987654321' })
            .send({
                email: 'testemai2l@test.com',
                code: 'test2',
                approve: true
            });

        expect(link.status).toEqual(404);
    });
});
