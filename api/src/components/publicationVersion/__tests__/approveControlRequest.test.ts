import * as testUtils from 'lib/testUtils';

beforeAll(async () => {
    await testUtils.clearDB();
    await testUtils.testSeed();
});

describe('Approve control requests', () => {
    test('User is not allowed to approve control request if they are not the corresponding author', async () => {
        const response = await testUtils.agent
            .post(
                '/publications/publication-problem-live-2/publication-versions/publication-problem-live-2-v2/approve-control-request'
            )
            .query({
                apiKey: '000000006'
            })
            .send({
                eventId: 'test-control-request',
                approve: false
            });

        expect(response.status).toEqual(403);
        expect(response.body.message).toEqual('You are not allowed to approve this control request.');
    });

    test('User is allowed to approve control request if they are the corresponding author', async () => {
        const response = await testUtils.agent
            .post(
                '/publications/publication-problem-live-2/publication-versions/publication-problem-live-2-v2/approve-control-request'
            )
            .query({
                apiKey: '123456789'
            })
            .send({
                eventId: 'test-control-request',
                approve: true
            });

        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('Successfully transferred control over this publication version.');

        // re-seed
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User is allowed to reject control request if they are the corresponding author', async () => {
        const response = await testUtils.agent
            .post(
                '/publications/publication-problem-live-2/publication-versions/publication-problem-live-2-v2/approve-control-request'
            )
            .query({
                apiKey: '123456789'
            })
            .send({
                eventId: 'test-control-request',
                approve: false
            });

        expect(response.status).toEqual(200);
        expect(response.body.message).toEqual('This control request has been rejected.');
    });
});
