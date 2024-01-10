import * as testUtils from 'lib/testUtils';

describe('Create flags on publications', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can create a valid flag on LIVE publication they did not create', async () => {
        const createFlag = await testUtils.agent
            .post('/publications/publication-interpretation-live/flags')
            .query({
                apiKey: '987654321'
            })
            .send({
                comment: 'Comments',
                category: 'ETHICAL_ISSUES'
            });

        expect(createFlag.status).toEqual(200);
    });

    test('User cannot create a valid flag on LIVE publication they created', async () => {
        const createFlag = await testUtils.agent
            .post('/publications/publication-interpretation-live/flags')
            .query({
                apiKey: '123456789'
            })
            .send({
                comment: 'Comments',
                category: 'ETHICAL_ISSUES'
            });

        expect(createFlag.status).toEqual(403);
    });

    test('User cannot create a invalid flag on LIVE publication they did not create', async () => {
        const createFlag = await testUtils.agent
            .post('/publications/publication-interpretation-live/flags')
            .query({
                apiKey: '987654321'
            })
            .send({
                comment: 'Comments',
                category: 'INVALID_CATEGORY'
            });

        expect(createFlag.status).toEqual(400);
    });

    test('User cannot create a duplicate flag for an unresolved flag', async () => {
        const createFlag = await testUtils.agent
            .post('/publications/publication-interpretation-live/flags')
            .query({
                apiKey: '987654321'
            })
            .send({
                comment: 'Comments',
                category: 'ETHICAL_ISSUES'
            });

        expect(createFlag.status).toEqual(200);

        const createFlagAttempt2 = await testUtils.agent
            .post('/publications/publication-interpretation-live/flags')
            .query({
                apiKey: '987654321'
            })
            .send({
                comment: 'Comments',
                category: 'ETHICAL_ISSUES'
            });

        expect(createFlagAttempt2.status).toEqual(400);
    });

    test('Cannot create a valid flag for a publication that is in DRAFT', async () => {
        const createFlag = await testUtils.agent
            .post('/publications/publication-interpretation-draft/flags')
            .query({
                apiKey: '987654321'
            })
            .send({
                comment: 'Comments',
                category: 'ETHICAL_ISSUES'
            });

        expect(createFlag.status).toEqual(404);
    });

    test('User can create 2 differente flags for the same publication that they did not create', async () => {
        const createFlag = await testUtils.agent
            .post('/publications/publication-interpretation-live/flags')
            .query({
                apiKey: '987654321'
            })
            .send({
                comment: 'Comments',
                category: 'ETHICAL_ISSUES'
            });

        expect(createFlag.status).toEqual(200);

        const createFlagAttempt2 = await testUtils.agent
            .post('/publications/publication-interpretation-live/flags')
            .query({
                apiKey: '987654321'
            })
            .send({
                comment: 'Comments',
                category: 'COPYRIGHT'
            });

        expect(createFlagAttempt2.status).toEqual(200);
    });
});
