import * as testUtils from 'lib/testUtils';

describe('create a reference', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can add a reference to their DRAFT publication', async () => {
        const reference = await testUtils.agent
            .post('/publications/publication-problem-draft/reference')
            .query({ apiKey: '000000005' })
            .send({
                id: '0001',
                location: 'http://octopus.ac',
                publicationId: 'publication-problem-draft',
                text: '<p>Reference 1</p>',
                type: 'TEXT'
            });

        expect(reference.status).toEqual(200);
    });

    test('User cannot add a reference to their LIVE publication', async () => {
        const reference = await testUtils.agent
            .post('/publications/publication-problem-live/reference')
            .query({ apiKey: '123456789' })
            .send({
                id: '0001',
                location: null,
                publicationId: 'publication-problem-live',
                text: '<p>Reference 1</p>',
                type: 'TEXT'
            });

        expect(reference.status).toEqual(403);
    });
    test('User cannot add a reference to another users DRAFT publication', async () => {
        const reference = await testUtils.agent
            .post('/publications/publication-problem-draft/reference')
            .query({ apiKey: '987654321' })
            .send({
                id: '0001',
                location: null,
                publicationId: 'publication-problem-draft',
                text: '<p>Reference 1</p>',
                type: 'TEXT'
            });

        expect(reference.status).toEqual(403);
    });
    test('User cannot add a reference to another LIVE publication', async () => {
        const reference = await testUtils.agent
            .post('/publications/publication-problem-live/reference')
            .query({ apiKey: '987654321' })
            .send({
                id: '0001',
                location: null,
                publicationId: 'publication-problem-live',
                text: '<p>Reference 1</p>',
                type: 'TEXT'
            });

        expect(reference.status).toEqual(403);
    });
    test('User must send correct information to create a reference (no id)', async () => {
        const reference = await testUtils.agent
            .post('/publications/publication-problem-draft/reference')
            .query({ apiKey: '000000005' })
            .send({
                id: null,
                location: null,
                publicationId: 'publication-problem-draft',
                text: '<p>Reference 1</p>',
                type: 'TEXT'
            });

        expect(reference.status).toEqual(422);
    });
    test('User must send correct information to create a reference (no publication id)', async () => {
        const reference = await testUtils.agent
            .post('/publications/publication-problem-draft/reference')
            .query({ apiKey: '000000005' })
            .send({
                id: '0001',
                location: null,
                publicationId: null,
                text: '<p>Reference 1</p>',
                type: 'TEXT'
            });

        expect(reference.status).toEqual(422);
    });
    test('User must send correct information to create a reference (incorrect type)', async () => {
        const reference = await testUtils.agent
            .post('/publications/publication-problem-draft/reference')
            .query({ apiKey: '000000005' })
            .send({
                id: '0001',
                location: null,
                publicationId: 'publication-problem-draft',
                text: '<p>Reference 1</p>',
                type: 'NUMBER'
            });

        expect(reference.status).toEqual(422);
    });
    test('User must send correct information to create a reference (no text)', async () => {
        const reference = await testUtils.agent
            .post('/publications/publication-problem-draft/reference')
            .query({ apiKey: '000000005' })
            .send({
                id: '0001',
                location: null,
                publicationId: 'publication-problem-draft',
                text: null,
                type: 'TEXT'
            });

        expect(reference.status).toEqual(422);
    });
});
