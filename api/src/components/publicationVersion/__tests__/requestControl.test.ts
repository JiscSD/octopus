import * as testUtils from 'lib/testUtils';

beforeAll(async () => {
    await testUtils.clearDB();
    await testUtils.testSeed();
});

describe('Request control over a publication version', () => {
    test('User cannot request control over a LIVE publication version', async () => {
        const response = await testUtils.agent
            .get(
                '/publications/publication-problem-live/publication-versions/publication-problem-live-v2/request-control'
            )
            .query({
                apiKey: '000000006'
            });

        expect(response.status).toEqual(400);
        expect(response.body.message).toEqual('You cannot request control over a published version.');
    });

    test('User cannot request control over their own publication version', async () => {
        const response = await testUtils.agent
            .get(
                '/publications/publication-problem-live-2/publication-versions/publication-problem-live-2-v2/request-control'
            )
            .query({
                apiKey: '123456789'
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual('You cannot request control over your own publication version.');
    });

    test('User cannot request control if they are not an author on the latest published version', async () => {
        const response = await testUtils.agent
            .get(
                '/publications/publication-problem-live-2/publication-versions/publication-problem-live-2-v2/request-control'
            )
            .query({
                apiKey: '000000005'
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual(
            'You do not have permission to request control over this publication version.'
        );
    });

    test('User can request control over a DRAFT publication version if they are an author on the latest LIVE version', async () => {
        const response = await testUtils.agent
            .get(
                '/publications/publication-problem-live-2/publication-versions/publication-problem-live-2-v2/request-control'
            )
            .query({
                apiKey: '000000006'
            });

        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('Successfully requested control over this publication version.');
    });

    test('User cannot request control again if they already made a request', async () => {
        const response = await testUtils.agent
            .get(
                '/publications/publication-problem-live-2/publication-versions/publication-problem-live-2-v2/request-control'
            )
            .query({
                apiKey: '000000006'
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual('You have already requested control over this publication version.');
    });
});
