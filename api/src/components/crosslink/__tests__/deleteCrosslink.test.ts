import * as testUtils from 'lib/testUtils';

describe('Delete a crosslink', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Crosslink owner can delete a crosslink', async () => {
        const deleteCrosslink = await testUtils.agent
            .delete('/crosslinks/problem-live-crosslink-1')
            .query({ apiKey: '123456789' });

        expect(deleteCrosslink.status).toEqual(200);
    });

    test('Cannot delete a non-existent crosslink', async () => {
        const deleteCrosslink = await testUtils.agent.delete('/crosslinks/made-up-id').query({ apiKey: '123456789' });

        expect(deleteCrosslink.status).toEqual(404);
    });

    test('Authenticated user other than owner cannot delete a crosslink', async () => {
        const deleteCrosslink = await testUtils.agent
            .delete('/crosslinks/problem-live-crosslink-1')
            .query({ apiKey: '987654321' });

        expect(deleteCrosslink.status).toEqual(403);
    });

    test('Anonymous user cannot delete a crosslink', async () => {
        const deleteCrosslink = await testUtils.agent.delete('/crosslinks/hypothesis-problem-crosslink');

        expect(deleteCrosslink.status).toEqual(401);
    });
});
