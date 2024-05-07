import * as testUtils from 'lib/testUtils';

describe('Get crosslinks of a publication', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Anonymous user can get crosslinks for a publication', async () => {
        const getCrosslinks = await testUtils.agent.get('/publications/publication-hypothesis-live/crosslinks');

        expect(getCrosslinks.status).toEqual(200);
        expect(getCrosslinks.body.data).toHaveLength(4);
        // Confirm that sort order is default (crosslink creation date, descending).
        expect(getCrosslinks.body.data[0].createdAt).toEqual('2024-01-22T13:00:00.000Z');
        expect(getCrosslinks.body.data[1].createdAt).toEqual('2024-01-22T12:00:00.000Z');
        expect(getCrosslinks.body.data[2].createdAt).toEqual('2024-01-22T11:00:00.000Z');
        expect(getCrosslinks.body.data[3].createdAt).toEqual('2024-01-22T10:00:00.000Z');
    });

    test('User can sort publication crosslinks by score', async () => {
        const getCrosslinks = await testUtils.agent
            .get('/publications/publication-hypothesis-live/crosslinks')
            .query({ order: 'relevant' });

        expect(getCrosslinks.status).toEqual(200);
        expect(getCrosslinks.body.data[0].score).toEqual(3);
        expect(getCrosslinks.body.data[1].score).toEqual(1);
        expect(getCrosslinks.body.data[2].score).toEqual(-1);
        expect(getCrosslinks.body.data[3].score).toEqual(-3);
    });

    test('User can get a mixed order of crosslinks', async () => {
        const getCrosslinks = await testUtils.agent
            .get('/publications/publication-hypothesis-live/crosslinks')
            .query({ order: 'mix' });

        expect(getCrosslinks.status).toEqual(200);
        // First 2 results have most recent crosslink created date, then others sorted by score.
        expect(getCrosslinks.body.data.recent[0].createdAt).toEqual('2024-01-22T13:00:00.000Z');
        expect(getCrosslinks.body.data.recent[1].createdAt).toEqual('2024-01-22T12:00:00.000Z');
        expect(getCrosslinks.body.data.relevant[0].score).toEqual(3);
        expect(getCrosslinks.body.data.relevant[1].score).toEqual(-3);
    });

    test('User must supply a recognised sort order', async () => {
        const getCrosslinks = await testUtils.agent
            .get('/publications/publication-hypothesis-live/crosslinks')
            .query({ order: 'nonsense' });

        expect(getCrosslinks.status).toEqual(400);
        expect(getCrosslinks.body.message[0].message).toEqual('must be equal to one of the allowed values');
        expect(getCrosslinks.body.message[0].params.allowedValues).toEqual(['mix', 'relevant', 'recent', null]);
    });

    test('User cannot get crosslinks for a non-existent publication ID', async () => {
        const getCrosslinks = await testUtils.agent.get('/publications/made-up-publication/crosslinks');

        expect(getCrosslinks.status).toEqual(404);
        expect(getCrosslinks.body.message).toEqual('Publication not found.');
    });

    test('User can filter crosslinks to ones they created', async () => {
        const getCrosslinks = await testUtils.agent
            .get('/publications/publication-hypothesis-live/crosslinks')
            .query({ own: true, apiKey: '123456789' });

        expect(getCrosslinks.status).toEqual(200);
        expect(getCrosslinks.body.data.length).toEqual(1);
        expect(getCrosslinks.body.data[0].createdBy).toEqual('test-user-1');
    });

    test('Anonymous user cannot filter to their own crosslinks', async () => {
        const getCrosslinks = await testUtils.agent
            .get('/publications/publication-hypothesis-live/crosslinks')
            .query({ own: true });

        expect(getCrosslinks.status).toEqual(400);
        expect(getCrosslinks.body.message).toEqual(
            'Cannot filter to your own items when the request is not authenticated.'
        );
    });

    test('User can filter crosslinks by publication title', async () => {
        const getCrosslinks = await testUtils.agent
            .get('/publications/publication-hypothesis-live/crosslinks')
            .query({ search: 'protocol' });

        expect(getCrosslinks.status).toEqual(200);
        expect(getCrosslinks.body.data.length).toEqual(1);
        expect(getCrosslinks.body.data[0].linkedPublication.id).toEqual('publication-protocol-live');
    });

    test('Number of crosslinks returned can be limited', async () => {
        const getCrosslinks = await testUtils.agent
            .get('/publications/publication-hypothesis-live/crosslinks')
            .query({ limit: 2 });

        expect(getCrosslinks.status).toEqual(200);
        expect(getCrosslinks.body.data.length).toEqual(2);
        expect(getCrosslinks.body.metadata.total).toEqual(4);
    });

    test('Results can be offset', async () => {
        const getCrosslinks = await testUtils.agent
            .get('/publications/publication-hypothesis-live/crosslinks')
            .query({ offset: 2 });

        expect(getCrosslinks.status).toEqual(200);
        expect(getCrosslinks.body.data.length).toEqual(2);
        // Expect to receive the results that would be third and fourth in a normal request.
        expect(getCrosslinks.body.data[0].createdAt).toEqual('2024-01-22T11:00:00.000Z');
        expect(getCrosslinks.body.data[1].createdAt).toEqual('2024-01-22T10:00:00.000Z');
    });
});
