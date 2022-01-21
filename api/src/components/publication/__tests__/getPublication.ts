import * as testUtils from 'lib/testUtils';

describe('View individual publications', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('User who created publication can see DRAFT publication', async () => {
        const getPublication = await testUtils.agent.get('/publications/publication-1').query({
            apiKey: '123456789'
        });

        expect(getPublication.body.id).toEqual('publication-1');
    });

    test('User who did not create publication cannot see DRAFT publication', async () => {
        const getPublication = await testUtils.agent.get('/publications/publication-1').query({
            apiKey: '987654321'
        });

        expect(getPublication.status).toEqual(404)
    });

    test('Cannot view publication in DRAFT without API key', async () => {
        const getPublication = await testUtils.agent.get('/publications/publication-1').query({
            apiKey: '987654321'
        });

        expect(getPublication.status).toEqual(404)
    });

    test.todo('Any user can see a LIVE publication');
});