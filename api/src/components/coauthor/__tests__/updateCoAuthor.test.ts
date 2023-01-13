import * as testUtils from 'lib/testUtils';

describe('Update co-author status', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Co-author updates their status to true', async () => {
        const coAuthor = await testUtils.agent
            .patch('/publications/publication-hypothesis-draft/coauthor-confirmation')
            .query({ apiKey: '000000006' })
            .send({
                confirm: true
            });

        expect(coAuthor.status).toEqual(200);
    });

    test('Co-author updates their status to false', async () => {
        const coAuthor = await testUtils.agent
            .patch('/publications/publication-problem-draft/coauthor-confirmation')
            .query({ apiKey: '000000006' })
            .send({
                confirm: false
            });

        expect(coAuthor.status).toEqual(200);
    });

    test('Cannot update co-author if not a co-author (1)', async () => {
        const coAuthor = await testUtils.agent
            .patch('/publications/publication-problem-draft/coauthor-confirmation')
            .query({ apiKey: '123456789' })
            .send({
                confirm: true
            });

        expect(coAuthor.status).toEqual(403);
    });

    test('Cannot update co-author if not a co-author (2)', async () => {
        const coAuthor = await testUtils.agent
            .patch('/publications/publication-problem-draft/coauthor-confirmation')
            .query({ apiKey: '987654321' })
            .send({
                confirm: true
            });

        expect(coAuthor.status).toEqual(403);
    });
});
