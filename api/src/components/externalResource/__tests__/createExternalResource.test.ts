import * as testUtils from 'lib/testUtils';

describe('Create an external resource', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can add an external resource to their DRAFT publication version', async () => {
        const createPayload = {
            title: 'Example title',
            url: 'https://jisc.ac.uk'
        };
        const createAdditionalField = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/external-resources')
            .query({ apiKey: '000000005' })
            .send(createPayload);

        expect(createAdditionalField.status).toEqual(200);
        expect(createAdditionalField.body).toMatchObject(createPayload);
    });

    test('User cannot add an external resource to a non-existent publication version', async () => {
        const createAdditionalField = await testUtils.agent
            .post('/publication-versions/made-up-publication-version-id/external-resources')
            .query({ apiKey: '000000005' })
            .send({
                title: 'Example title',
                url: 'https://jisc.ac.uk'
            });

        expect(createAdditionalField.status).toEqual(404);
        expect(createAdditionalField.body.message).toEqual('This publication version does not exist');
    });

    test('User cannot add an external resource to their LIVE publication version', async () => {
        const createAdditionalField = await testUtils.agent
            .post('/publication-versions/publication-problem-live-v1/external-resources')
            .query({ apiKey: '123456789' })
            .send({
                title: 'Example title',
                url: 'https://jisc.ac.uk'
            });

        expect(createAdditionalField.status).toEqual(403);
        expect(createAdditionalField.body.message).toEqual(
            'You can only add an external resource to a draft publication'
        );
    });

    test('User cannot add an external resource to a DRAFT publication version they do not own', async () => {
        const createAdditionalField = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/external-resources')
            .query({ apiKey: '123456789' })
            .send({
                title: 'Example title',
                url: 'https://jisc.ac.uk'
            });

        expect(createAdditionalField.status).toEqual(403);
        expect(createAdditionalField.body.message).toEqual(
            'You cannot add an external resource to a publication version you do not own'
        );
    });

    test('User cannot create an external resource without supplying a title', async () => {
        const createAdditionalField = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/external-resources')
            .query({ apiKey: '000000005' })
            .send({
                url: 'https://jisc.ac.uk'
            });

        expect(createAdditionalField.status).toEqual(422);
    });

    test('User cannot create an external resource without supplying a URL', async () => {
        const createAdditionalField = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/external-resources')
            .query({ apiKey: '000000005' })
            .send({
                title: 'Example title'
            });

        expect(createAdditionalField.status).toEqual(422);
    });

    test('User cannot supply a description over 255 characters long', async () => {
        const createAdditionalField = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/external-resources')
            .query({ apiKey: '000000005' })
            .send({
                title: 'Example title',
                url: 'https://jisc.ac.uk',
                description:
                    'This is a description that is 256 characters long. It has to be this long in order to test the validation of the create external resource API endpoint. If this request gets rejected with a status code of 422, that means that the validation has rejected it.'
            });

        expect(createAdditionalField.status).toEqual(422);
    });

    test('User cannot supply an invalid URL', async () => {
        const createAdditionalField = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/external-resources')
            .query({ apiKey: '000000005' })
            .send({
                title: 'Example title',
                url: 'an ordinary string'
            });

        expect(createAdditionalField.status).toEqual(403);
        expect(createAdditionalField.body.message).toEqual('You must supply a valid URL');
    });
});
