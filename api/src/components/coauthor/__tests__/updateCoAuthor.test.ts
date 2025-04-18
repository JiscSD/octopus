import * as client from 'lib/client';
import * as testUtils from 'lib/testUtils';

describe('Update co-author status', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Co-author updates their status to true', async () => {
        const coAuthor = await testUtils.agent
            .patch('/publication-versions/publication-problem-locked-1-v1/coauthor-confirmation')
            .query({ apiKey: '000000006' })
            .send({
                confirm: true
            });

        expect(coAuthor.status).toEqual(200);
    });

    test('Co-author updates their status to false', async () => {
        const coAuthor = await testUtils.agent
            .patch('/publication-versions/publication-problem-locked-1-v1/coauthor-confirmation')
            .query({ apiKey: '000000006' })
            .send({
                confirm: false
            });

        expect(coAuthor.status).toEqual(200);
    });

    test('Cannot update co-author if not a co-author (1)', async () => {
        const coAuthor = await testUtils.agent
            .patch('/publication-versions/publication-problem-locked-1-v1/coauthor-confirmation')
            .query({ apiKey: '123456789' })
            .send({
                confirm: true
            });

        expect(coAuthor.status).toEqual(403);
    });

    test('Cannot update co-author if not a co-author (2)', async () => {
        const coAuthor = await testUtils.agent
            .patch('/publication-versions/publication-problem-locked-1-v1/coauthor-confirmation')
            .query({ apiKey: '987654321' })
            .send({
                confirm: true
            });

        expect(coAuthor.status).toEqual(403);
    });

    test('Co-author can choose whether their approval is retained', async () => {
        const confirmation = await testUtils.agent
            .patch('/publication-versions/publication-problem-locked-1-v1/coauthor-confirmation')
            .query({ apiKey: '000000006' })
            .send({
                confirm: true,
                retainApproval: false
            });

        expect(confirmation.status).toEqual(200);
        const coAuthor = await client.prisma.coAuthors.findFirst({
            where: {
                publicationVersionId: 'publication-problem-locked-1-v1',
                linkedUser: 'test-user-6'
            }
        });
        expect(coAuthor?.retainApproval).toEqual(false);
    });
});
