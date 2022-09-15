import * as testUtils from 'lib/testUtils';

describe('update a reference', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('An authenticated author can update a reference', async () => {
        const reference = await testUtils.agent
            .patch('/publications/publication-interpretation-draft/reference/01')
            .query({ apiKey: '123456789' })
            .send({
                id: '01',
                location: 'http://octopus.ac',
                publicationId: 'publication-problem-draft',
                text: '<p>Reference 1</p>',
                type: 'TEXT'
            });

        expect(reference.status).toEqual(200);
    });

    test('The publication must be in draft state', async () => {
        const reference = await testUtils.agent
            .patch('/publications/publication-real-world-application-live/reference/03')
            .query({ apiKey: '123456789' })
            .send({
                id: '03',
                location: 'http://octopus.ac',
                publicationId: 'publication-real-world-application-live',
                text: '<p>Reference 1</p>',
                type: 'TEXT'
            });

        expect(reference.status).toEqual(403);
    });

    test('The user must be the author of the publication', async () => {
        const reference = await testUtils.agent
            .patch('/publications/publication-interpretation-draft/reference/01')
            .query({ apiKey: '000000005' })
            .send({
                id: '01',
                location: 'http://octopus.ac',
                publicationId: 'publication-problem-draft',
                text: '<p>Reference 1</p>',
                type: 'TEXT'
            });

        expect(reference.status).toEqual(403);
    });

    test('The id cannot be amended', async () => {
        const reference = await testUtils.agent
            .patch('/publications/publication-interpretation-draft/reference/01')
            .query({ apiKey: '000000005' })
            .send({
                id: '0000004',
                location: 'http://octopus.ac',
                publicationId: 'publication-problem-draft',
                text: '<p>Reference 1</p>',
                type: 'TEXT'
            });

        expect(reference.status).toEqual(403);
    });

    test('The publication id cannot be amended', async () => {
        const reference = await testUtils.agent
            .patch('/publications/publication-interpretation-draft/reference/01')
            .query({ apiKey: '000000005' })
            .send({
                id: '01',
                location: 'http://octopus.ac',
                publicationId: 'made-up-publication-id',
                text: '<p>Reference 1</p>',
                type: 'TEXT'
            });

        expect(reference.status).toEqual(403);
    });
});
