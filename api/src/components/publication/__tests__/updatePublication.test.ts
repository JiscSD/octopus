import * as testUtils from 'lib/testUtils';

beforeEach(async () => {
    await testUtils.clearDB();
    await testUtils.initialSeed();
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

    test('Can update publication title', async () => {
        const updatePublication = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({ apiKey: 123456789 })
            .send({ title: 'New title' });

        expect(updatePublication.status).toEqual(200);
        expect(updatePublication.body.title).toEqual('New title');
    });

    test('Can update publication content if "safe" HTML', async () => {
        const updatePublication = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({ apiKey: 123456789 })
            .send({ content: '<p>Hello <a href="#nathan">Nathan</a></p>' });

        expect(updatePublication.status).toEqual(200);
    });

    test('Cannot update publication content if HTML not "safe" (1)', async () => {
        const updatePublication = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({ apiKey: 123456789 })
            .send({ content: '<p class="class">Hello <a href="#nathan">Nathan</a></p>' });

        expect(updatePublication.status).toEqual(404);
    });

    test('Cannot update publication content if HTML not "safe" (2)', async () => {
        const updatePublication = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({ apiKey: 123456789 })
            .send({ content: '<p style="color: red;">Hello <a href="#nathan">Nathan</a></p>' });

        expect(updatePublication.status).toEqual(404);
    });

    test('Can update publication id', async () => {
        const updatePublication = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({ apiKey: 123456789 })
            .send({ id: 'brand-new-id' });

        expect(updatePublication.body.id).toEqual('brand-new-id');
    });

    test('Can update publication licence', async () => {
        const updatePublication = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({ apiKey: 123456789 })
            .send({ licence: 'CC_BY_ND' });

        expect(updatePublication.body.licence).toEqual('CC_BY_ND');
    });

    test('Can update keywords', async () => {
        const updatePublication = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({ apiKey: 123456789 })
            .send({ keywords: ['science', 'technology'] });

        expect(updatePublication.body.keywords.length).toEqual(2);
    });

    test('Can update description', async () => {
        const updatePublication = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({ apiKey: 123456789 })
            .send({ description: 'Test description' });

        expect(updatePublication.body.description).toEqual('Test description');
    });

    test('Cannot update publication with invalid licence enum', async () => {
        const updatePublication = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({ apiKey: 123456789 })
            .send({ licence: 'INVALID' });

        expect(updatePublication.status).toEqual(422);
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

        expect(updatePublication.status).toEqual(404);
    });

    test('Cannot add more than 10 keywords', async () => {
        const updatePublication = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({ apiKey: 123456789 })
            .send({ keywords: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] });

        expect(updatePublication.status).toEqual(422);
    });

    test('Cannot add more than 160 characters into a description', async () => {
        const updatePublication = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({ apiKey: 123456789 })
            .send({
                description:
                    'testing123testing123testing123testing123testing123testing123testing123testing123testing123testing123testing123testing123testing123testing123testing123testing123x'
            });

        expect(updatePublication.status).toEqual(422);
    });

    // Language tests
    test('Valid publication updated by real user when provided a correct ISO-639-1 language code', async () => {
        const createPublicationRequest = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({
                apiKey: '123456789'
            })
            .send({
                language: 'fr'
            });

        expect(createPublicationRequest.status).toEqual(200);
        expect(createPublicationRequest.body.language).toEqual('fr');
    });

    test('Publication failed to be updated if language code provided is not out of the ISO-639-1 language list', async () => {
        const createPublicationRequest = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({
                apiKey: '123456789'
            })
            .send({
                language: 'zz' // https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
            });

        expect(createPublicationRequest.status).toEqual(422);
    });

    test('Publication failed to be updated if language provided is less than 2 chars', async () => {
        const createPublicationRequest = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({
                apiKey: '123456789'
            })
            .send({
                language: 'e'
            });

        expect(createPublicationRequest.status).toEqual(422);
    });

    test('Publication failed to be updated if language provided is more than 2 chars', async () => {
        const createPublicationRequest = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({
                apiKey: '123456789'
            })
            .send({
                language: 'enn'
            });

        expect(createPublicationRequest.status).toEqual(422);
    });

    test('Publication failed to update if is not protocol or hypotheses and supplys a self declaration', async () => {
        const createPublicationRequest = await testUtils.agent
            .patch('/publications/publication-interpretation-draft')
            .query({
                apiKey: '123456789'
            })
            .send({
                selfDeclaration: true
            });

        expect(createPublicationRequest.status).toEqual(400);
    });
});
