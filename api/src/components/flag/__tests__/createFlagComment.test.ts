import * as testUtils from 'lib/testUtils';

describe('Create flags comments on a flag', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('User who created the flag can leave comments', async () => {
        const createFlagComment = await testUtils.agent
            .post('/flag/publication-problem-live-flag/comment')
            .query({
                apiKey: '987654321'
            })
            .send({
                comment: 'Comments'
            });

        expect(createFlagComment.status).toEqual(200);
    });

    test('Owner of the publication can leave comments', async () => {
        const createFlagComment = await testUtils.agent
            .post('/flag/publication-problem-live-flag/comment')
            .query({
                apiKey: '123456789'
            })
            .send({
                comment: 'Comments'
            });
        expect(createFlagComment.status).toEqual(200);
    });

    test('You cannot leave a comment on an resolved flag', async () => {
        const createFlagComment = await testUtils.agent
            .post('/flag/publication-hypothesis-live/comment')
            .query({
                apiKey: '123456789'
            })
            .send({
                comment: 'Comments'
            });

        expect(createFlagComment.status).toEqual(404);
    });

    test('You cannot leave a comment on an un-flagged publication', async () => {
        const createFlagComment = await testUtils.agent
            .post('/flag/publication-analysis-live/comment')
            .query({
                apiKey: '123456789'
            })
            .send({
                comment: 'Comments'
            });

        expect(createFlagComment.status).toEqual(404);
    });

    test('You can only leave a comment if you are either the author of the publication or the flagger', async () => {
        const createFlagComment = await testUtils.agent
            .post('/flag/publication-problem-live-flag/comment')
            .query({
                apiKey: '1234'
            })
            .send({
                comment: 'Comments'
            });

        expect(createFlagComment.status).toEqual(403);
    });

    test('The body of the request is invalid', async () => {
        const createFlagComment = await testUtils.agent
            .post('/flag/publication-problem-live-flag/comment')
            .query({
                apiKey: '123456789'
            })
            .send({
                comments: 'Comments'
            });
        expect(createFlagComment.status).toEqual(422);
    });
});
