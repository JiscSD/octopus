import * as testUtils from 'lib/testUtils';

describe('Create a piece of additional information', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can add additional information to their DRAFT publication version', async () => {
        const createPayload = {
            title: 'Example title',
            url: 'https://jisc.ac.uk'
        };
        const createAdditionalInformation = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/additional-information')
            .query({ apiKey: '000000005' })
            .send(createPayload);

        expect(createAdditionalInformation.status).toEqual(200);
        expect(createAdditionalInformation.body).toMatchObject(createPayload);
    });

    test('User cannot add additional information to a non-existent publication version', async () => {
        const createAdditionalInformation = await testUtils.agent
            .post('/publication-versions/made-up-publication-version-id/additional-information')
            .query({ apiKey: '000000005' })
            .send({
                title: 'Example title',
                url: 'https://jisc.ac.uk'
            });

        expect(createAdditionalInformation.status).toEqual(404);
        expect(createAdditionalInformation.body.message).toEqual('This publication version does not exist');
    });

    test('User cannot add additional information to their LIVE publication version', async () => {
        const createAdditionalInformation = await testUtils.agent
            .post('/publication-versions/publication-problem-live-v1/additional-information')
            .query({ apiKey: '123456789' })
            .send({
                title: 'Example title',
                url: 'https://jisc.ac.uk'
            });

        expect(createAdditionalInformation.status).toEqual(400);
        expect(createAdditionalInformation.body.message).toEqual(
            'You can only add additional information to a draft publication'
        );
    });

    test('User cannot add additional information to a DRAFT publication version they do not own', async () => {
        const createAdditionalInformation = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/additional-information')
            .query({ apiKey: '123456789' })
            .send({
                title: 'Example title',
                url: 'https://jisc.ac.uk'
            });

        expect(createAdditionalInformation.status).toEqual(403);
        expect(createAdditionalInformation.body.message).toEqual(
            'You cannot add additional information to a publication version you do not own'
        );
    });

    test('User cannot create additional information without supplying a title', async () => {
        const createAdditionalInformation = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/additional-information')
            .query({ apiKey: '000000005' })
            .send({
                url: 'https://jisc.ac.uk'
            });

        expect(createAdditionalInformation.status).toEqual(400);
    });

    test('User cannot create additional information without supplying a URL', async () => {
        const createAdditionalInformation = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/additional-information')
            .query({ apiKey: '000000005' })
            .send({
                title: 'Example title'
            });

        expect(createAdditionalInformation.status).toEqual(400);
    });

    test('User cannot supply a description over 255 characters long', async () => {
        const createAdditionalInformation = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/additional-information')
            .query({ apiKey: '000000005' })
            .send({
                title: 'Example title',
                url: 'https://jisc.ac.uk',
                description:
                    'This is a description that is 256 characters long. It has to be this long in order to test the validation of the create external resource API endpoint. If this request gets rejected with a status code of 400, that means that the validation has rejected it.'
            });

        expect(createAdditionalInformation.status).toEqual(400);
    });

    test('User cannot supply an invalid URL', async () => {
        const createAdditionalInformation = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/additional-information')
            .query({ apiKey: '000000005' })
            .send({
                title: 'Example title',
                url: 'an ordinary string'
            });

        expect(createAdditionalInformation.status).toEqual(403);
        expect(createAdditionalInformation.body.message).toEqual('Please supply a valid URL starting with "http"');
    });
});
