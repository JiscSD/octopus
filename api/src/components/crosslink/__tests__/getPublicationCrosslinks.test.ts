import * as testUtils from 'lib/testUtils';

describe('Get crosslinks of a publication', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Anonymous user can get crosslinks for a publication', async () => {
        const getCrosslinks = await testUtils.agent.get('/publications/publication-hypothesis-live/crosslinks');

        expect(getCrosslinks.status).toEqual(200);
        expect(getCrosslinks.body).toHaveLength(4);
        // Confirm that sort order is default (crosslink creation date, descending).
        expect(getCrosslinks.body[0].createdAt).toEqual('2024-01-22T13:00:00.000Z');
        expect(getCrosslinks.body[1].createdAt).toEqual('2024-01-22T12:00:00.000Z');
        expect(getCrosslinks.body[2].createdAt).toEqual('2024-01-22T11:00:00.000Z');
        expect(getCrosslinks.body[3].createdAt).toEqual('2024-01-22T10:00:00.000Z');
    });

    test('User can sort publication crosslinks by score', async () => {
        const getCrosslinks = await testUtils.agent
            .get('/publications/publication-hypothesis-live/crosslinks')
            .query({ order: 'relevant' });

        expect(getCrosslinks.status).toEqual(200);
        expect(getCrosslinks.body[0].score).toEqual(3);
        expect(getCrosslinks.body[1].score).toEqual(1);
        expect(getCrosslinks.body[2].score).toEqual(-1);
        expect(getCrosslinks.body[3].score).toEqual(-3);
    });

    test('User can get a mixed order of crosslinks', async () => {
        const getCrosslinks = await testUtils.agent
            .get('/publications/publication-hypothesis-live/crosslinks')
            .query({ order: 'mix' });

        expect(getCrosslinks.status).toEqual(200);
        // First 2 results have most recent crosslink created date, then others sorted by score.
        expect(getCrosslinks.body[0].createdAt).toEqual('2024-01-22T13:00:00.000Z');
        expect(getCrosslinks.body[1].createdAt).toEqual('2024-01-22T12:00:00.000Z');
        expect(getCrosslinks.body[2].score).toEqual(3);
        expect(getCrosslinks.body[3].score).toEqual(-3);
    });

    test('User must supply a recognised sort order', async () => {
        const getCrosslinks = await testUtils.agent
            .get('/publications/publication-hypothesis-live/crosslinks')
            .query({ order: 'nonsense' });

        expect(getCrosslinks.status).toEqual(400);
        expect(getCrosslinks.body.message[0].message).toEqual('must be equal to one of the allowed values');
        expect(getCrosslinks.body.message[0].params.allowedValues).toEqual(['mix', 'relevant', null]);
    });

    test('User cannot get crosslinks for a non-existent publication ID', async () => {
        const getCrosslinks = await testUtils.agent.get('/publications/made-up-publication/crosslinks');

        expect(getCrosslinks.status).toEqual(404);
        expect(getCrosslinks.body.message).toEqual('Publication not found.');
    });
});
