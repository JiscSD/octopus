import * as testUtils from 'lib/testUtils';

describe('Create publication', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Valid publication created by real user, status is correct too (200)', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'PEER_REVIEW',
                title: 'Publication test 1',
                licence: 'CC_BY_SA',
                description: 'description of Publication test 1',
                keywords: ['science', 'technology']
            });

        expect(createPublicationRequest.status).toEqual(201);

        expect(createPublicationRequest.body.versions.length).toEqual(1);

        expect(createPublicationRequest.body.versions[0].createdBy).toEqual('test-user-1');
        expect(createPublicationRequest.body.versions[0].currentStatus).toEqual('DRAFT');
        expect(createPublicationRequest.body.versions[0].keywords.length).toEqual(2);
        expect(createPublicationRequest.body.versions[0].description).toEqual('description of Publication test 1');
        expect(createPublicationRequest.body.versions[0].licence).toEqual('CC_BY_SA');
    });

    test('Valid publication created by real user with content (200)', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'PEER_REVIEW',
                title: 'Publication test 2',
                content: 'Content'
            });

        expect(createPublicationRequest.status).toEqual(201);
    });

    test('Valid publication not created by user that does not exist (401)', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123'
            })
            .send({
                type: 'PEER_REVIEW',
                title: 'Publication test 3'
            });

        expect(createPublicationRequest.status).toEqual(401);
    });

    test('Invalid publication type, created by user that does exist (400)', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'NOT_REAL',
                title: 'Publication test 4'
            });

        expect(createPublicationRequest.status).toEqual(400);
    });

    test('Attempt to create publication with no title, created by user that does exist (400)', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'PEER_REVIEW',
                content: 'Content'
            });

        expect(createPublicationRequest.status).toEqual(400);
    });

    test('Attempt to create publication with no title, content or type, created by user that does exist (400)', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({});

        expect(createPublicationRequest.status).toEqual(400);
    });

    test('Attempt to create publication with added invalid properties, created by user that does exist (400)', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                title: 'Example',
                type: 'PEER_REVIEW',
                content: 'Content',
                keyDoesNotExist: 'This should return a 400'
            });

        expect(createPublicationRequest.status).toEqual(400);
    });

    test('Valid publication created by real user with content does not have a publishedDate (200)', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'PEER_REVIEW',
                title: 'Publication test 2',
                content: 'Content'
            });

        expect(createPublicationRequest.status).toEqual(201);
        expect(createPublicationRequest.body.versions[0].publishedDate).toBeNull();
    });

    test('Valid publicatiom created by real user when provided a correct ISO-639-1 language code', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'PROBLEM',
                title: 'Publication language test 1',
                content: 'Content',
                language: 'fr'
            });

        expect(createPublicationRequest.status).toEqual(201);
        expect(createPublicationRequest.body.versions[0].language).toEqual('fr');
    });

    test('Publication failed to be created if language code provided is not out of the ISO-639-1 language list', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'PROBLEM',
                title: 'Publication language test 2',
                content: 'Content',
                language: 'zz' // https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
            });

        expect(createPublicationRequest.status).toEqual(400);
    });

    test('Publication failed to be created if language provided is less than 2 chars', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'PROBLEM',
                title: 'Publication language test 3',
                content: 'Content',
                language: 'e'
            });

        expect(createPublicationRequest.status).toEqual(400);
    });

    test('Publication failed to be created if language provided is more than 2 chars', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'PROBLEM',
                title: 'Publication language test 4',
                content: 'Content',
                language: 'enn'
            });

        expect(createPublicationRequest.status).toEqual(400);
    });

    test('Publication created with default language code if no language code is provided', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'PROBLEM',
                title: 'Publication language test 5',
                content: 'Content'
            });

        expect(createPublicationRequest.status).toEqual(201);
        expect(createPublicationRequest.body.versions[0].language).toEqual('en');
    });

    test('Publication can not be created if supplying a self declaration and if not a protocol or hypotheses', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'PROBLEM',
                title: 'Publication with self declaration and is not a protocol or hypotheses',
                selfDeclaration: true
            });

        expect(createPublicationRequest.status).toEqual(400);
    });

    test('Publication can be created if not supplying a self declration and is of type protocol', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'PROTOCOL',
                title: 'Publication with self declaration and is protocol',
                selfDeclaration: true
            });

        expect(createPublicationRequest.status).toEqual(201);
        expect(createPublicationRequest.body.type).toEqual('PROTOCOL');
        expect(createPublicationRequest.body.versions[0].selfDeclaration).toEqual(true);
    });

    test('Publication can be created if not supplying a self declration and is of type hypotheses', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'HYPOTHESIS',
                title: 'Publication with self declaration and is hypotheses',
                selfDeclaration: true
            });

        expect(createPublicationRequest.status).toEqual(201);
        expect(createPublicationRequest.body.type).toEqual('HYPOTHESIS');
        expect(createPublicationRequest.body.versions[0].selfDeclaration).toEqual(true);
    });

    test('Publication can be linked to topic on creation', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'PROBLEM',
                title: 'Publication related to a topic',
                topicIds: ['test-topic-1']
            });

        expect(createPublicationRequest.status).toEqual(201);
        expect(createPublicationRequest.body.versions[0].topics[0].title).toEqual('Test topic');
    });

    test('Organisational accounts can create problems', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '000000012'
            })
            .send({
                type: 'PROBLEM',
                title: 'Problem by an organisational account'
            });

        expect(createPublicationRequest.status).toEqual(201);
    });

    test('Organisational accounts cannot create types other than problems', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '000000012'
            })
            .send({
                type: 'HYPOTHESIS',
                title: 'Hypothesis by an organisational account'
            });

        expect(createPublicationRequest.status).toEqual(403);
        expect(createPublicationRequest.body.message).toEqual(
            'Organisational accounts can only create Research Problems'
        );
    });
});
