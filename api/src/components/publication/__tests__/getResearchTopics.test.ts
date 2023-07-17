import * as testUtils from 'lib/testUtils';

describe('Research Topics', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Get list of research topics published by Science Octopus', async () => {
        const response = await testUtils.agent.get('/publications/research-topics');

        expect(response.status).toEqual(200);

        expect(
            response.body.every(
                (item) =>
                    item.type === 'PROBLEM' &&
                    item.createdBy === 'octopus' &&
                    (item.content.includes('This is an automatically-generated topic') as boolean)
            )
        ).toBe(true);
    });
});
