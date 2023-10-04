import * as testUtils from 'lib/testUtils';

beforeAll(async () => {
    await testUtils.clearDB();
    await testUtils.testSeed();
});

describe('Update publication', () => {
    test('Cannot update without permission', async () => {
        const updatePublication = await testUtils.agent.patch('/publications/publication-interpretation-draft');

        expect(updatePublication.status).toEqual(401);
    });

    test('Cannot update with incorrect permissions', async () => {
        const updatePublication = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({ apiKey: 987654321 });

        expect(updatePublication.status).toEqual(403);
    });

    test('Cannot update publication with invalid update parameter', async () => {
        const updatePublication = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({ apiKey: 123456789 })
            .send({ doesNotExist: 'invalid-parameter' });

        expect(updatePublication.status).toEqual(422);
    });

    test('Cannot update LIVE publication', async () => {
        const updatePublication = await testUtils.agent
            .patch('/publications/publication-real-world-application-live')
            .query({ apiKey: 123456789 })
            .send({ title: 'Brand new title' });

        expect(updatePublication.status).toEqual(422);
    });
});
