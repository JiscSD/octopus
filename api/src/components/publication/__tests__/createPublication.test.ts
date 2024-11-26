import * as testUtils from 'lib/testUtils';

describe('Create draft publication', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Real user can create a draft publication', async () => {
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
        expect(createPublicationRequest.body.versions[0].isLatestLiveVersion).toEqual(false);
        expect(createPublicationRequest.body.versions[0].publishedDate).toBeNull();
        expect(createPublicationRequest.body.versions[0].keywords.length).toEqual(2);
        expect(createPublicationRequest.body.versions[0].description).toEqual('description of Publication test 1');
        expect(createPublicationRequest.body.versions[0].licence).toEqual('CC_BY_SA');
    });

    test('Content is saved on create', async () => {
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
        expect(createPublicationRequest.body.versions[0].content).toEqual('Content');
    });

    test('Publication cannot be created with invalid API key', async () => {
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

    test('Valid publication type must be provided', async () => {
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
        expect(createPublicationRequest.body.message[0].instancePath).toEqual('/type');
        expect(createPublicationRequest.body.message[0].keyword).toEqual('enum');
    });

    test('Title must be provided', async () => {
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
        expect(createPublicationRequest.body.message[0].keyword).toEqual('required');
        expect(createPublicationRequest.body.message[0].params.missingProperty).toEqual('title');
    });

    test('Title cannot be empty', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'PROBLEM',
                title: ''
            });

        expect(createPublicationRequest.status).toEqual(400);
        expect(createPublicationRequest.body.message[0].instancePath).toEqual('/title');
        expect(createPublicationRequest.body.message[0].keyword).toEqual('minLength');
    });

    test('Type must be provided', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({ title: 'Hello' });

        expect(createPublicationRequest.status).toEqual(400);
        expect(createPublicationRequest.body.message[0].keyword).toEqual('required');
        expect(createPublicationRequest.body.message[0].params.missingProperty).toEqual('type');
    });

    test('Additional properties are not accepted', async () => {
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
        expect(createPublicationRequest.body.message[0].keyword).toEqual('additionalProperties');
        expect(createPublicationRequest.body.message[0].params.additionalProperty).toEqual('keyDoesNotExist');
    });

    test('Valid ISO-639-1 language code is accepted', async () => {
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

    test('Language codes not belonging to ISO-639-1 language list are not accepted', async () => {
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
        expect(createPublicationRequest.body.message[0].instancePath).toEqual('/language');
        expect(createPublicationRequest.body.message[0].keyword).toEqual('enum');
    });

    test('Publication is created with default language code if no language code is provided', async () => {
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

    test('Self declaration is not accepted when type is not protocol or hypothesis', async () => {
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
        expect(createPublicationRequest.body.message).toEqual(
            'You cannot declare a self declaration for a publication that is not a protocol or hypothesis.'
        );
    });

    test('Self declaration is accepted if type is protocol', async () => {
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

    test('Self declaration is accepted if type is hypothesis', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'HYPOTHESIS',
                title: 'Publication with self declaration and is hypothesis',
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

    test('Topics cannot be linked when type is not PROBLEM', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'HYPOTHESIS',
                title: 'Publication related to a topic',
                topicIds: ['test-topic-1']
            });

        expect(createPublicationRequest.status).toEqual(400);
        expect(createPublicationRequest.body.message).toEqual(
            'You cannot link a publication to a topic if it is not a research problem.'
        );
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
            'Organisational accounts can only create Research Problems.'
        );
    });

    test('Only organisational accounts can populate externalId and externalSource fields', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789'
            })
            .send({
                type: 'PROBLEM',
                title: 'Attempt at external fields',
                externalId: '12345',
                externalSource: 'ARI'
            });

        expect(createPublicationRequest.status).toEqual(400);
        expect(createPublicationRequest.body.message).toEqual(
            'External ID and external source fields can only be populated by organisational accounts.'
        );
    });

    test('External source must have a recognised value', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '000000012'
            })
            .send({
                type: 'PROBLEM',
                title: 'Attempt at external fields',
                externalId: '12345',
                externalSource: 'unrecognisedSource'
            });

        expect(createPublicationRequest.status).toEqual(400);
        expect(createPublicationRequest.body.message[0].instancePath).toEqual('/externalSource');
        expect(createPublicationRequest.body.message[0].keyword).toEqual('enum');
    });

    test('External source and external ID must be supplied together if at all', async () => {
        const onlyExternalSource = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '000000012'
            })
            .send({
                type: 'PROBLEM',
                title: 'Only external source',
                externalSource: 'ARI'
            });

        expect(onlyExternalSource.status).toEqual(400);
        expect(onlyExternalSource.body.message).toEqual(
            'An external ID must be accompanied by an external source and vice versa.'
        );

        const onlyExternalId = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '000000012'
            })
            .send({
                type: 'PROBLEM',
                title: 'Only external ID',
                externalId: '12345'
            });

        expect(onlyExternalId.status).toEqual(400);
        expect(onlyExternalId.body.message).toEqual(
            'An external ID must be accompanied by an external source and vice versa.'
        );
    });
});

describe('Create live publication', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Organisational accounts can publish directly', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '000000012',
                directPublish: 'true'
            })
            .send({ type: 'PROBLEM', title: 'Direct publish by organisational account', content: 'Test' });

        expect(createPublicationRequest.status).toEqual(201);
        expect(createPublicationRequest.body.versions.length).toEqual(1);
        expect(createPublicationRequest.body.versions[0].currentStatus).toEqual('LIVE');
        expect(createPublicationRequest.body.versions[0].isLatestLiveVersion).toEqual(true);
        expect(createPublicationRequest.body.versions[0].publishedDate).not.toBeNull();
        // Organisational account's default topic is attached.
        expect(createPublicationRequest.body.versions[0].topics).toHaveLength(1);
        expect(createPublicationRequest.body.versions[0].topics[0].id).toEqual('test-topic-1');
    });

    test('Only organisational accounts can publish directly', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '123456789',
                directPublish: 'true'
            })
            .send({ type: 'PROBLEM', title: 'Direct publish by normal user' });

        expect(createPublicationRequest.status).toEqual(403);
        expect(createPublicationRequest.body.message).toEqual('Only organisational accounts can publish directly.');
    });

    test('Query params other than directPublish are not accepted', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '000000012',
                unrecognisedParam: 'true'
            })
            .send({ type: 'PROBLEM', title: 'Unrecognised query parameter publication' });

        expect(createPublicationRequest.status).toEqual(400);
        expect(createPublicationRequest.body.message[0].keyword).toEqual('additionalProperties');
        expect(createPublicationRequest.body.message[0].params.additionalProperty).toEqual('unrecognisedParam');
    });

    test('Content value is required to direct publish', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '000000012',
                directPublish: 'true'
            })
            .send({ type: 'PROBLEM', title: 'Direct publish by organisational account' });

        expect(createPublicationRequest.status).toEqual(400);
        expect(createPublicationRequest.body.message).toEqual(
            'Content field cannot be empty when publishing directly.'
        );
    });

    test('Cannot direct publish with an invalid conflict of interest', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '000000012',
                directPublish: 'true'
            })
            .send({
                type: 'PROBLEM',
                title: 'Direct publish by organisational account',
                content: 'Test',
                conflictOfInterestStatus: true,
                conflictOfInterestText: ''
            });

        expect(createPublicationRequest.status).toEqual(400);
        expect(createPublicationRequest.body.message).toEqual(
            'Conflict of interest status must either be false, or true and accompanied by a conflict of interest text value in order to direct publish.'
        );
    });

    test('Organisations without a default topic must supply a topic ID or publication ID to link to', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '000000013',
                directPublish: 'true'
            })
            .send({ type: 'PROBLEM', title: 'Direct publish by organisational account', content: 'Test' });

        expect(createPublicationRequest.status).toEqual(400);
        expect(createPublicationRequest.body.message).toEqual(
            'At least one topic ID or linked publication ID must be provided, as your organisation does not have a default topic.'
        );
    });

    test('Publication links are correctly created when provided', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '000000013',
                directPublish: 'true'
            })
            .send({
                type: 'PROBLEM',
                title: 'Direct publish by organisational account',
                content: 'Test',
                linkedPublicationIds: ['publication-problem-live', 'publication-problem-live-2']
            });

        expect(createPublicationRequest.status).toEqual(201);
        expect(
            createPublicationRequest.body.linkedTo.sort((a, b) => a.publicationToId - b.publicationToId)
        ).toMatchObject([
            { publicationToId: 'publication-problem-live', versionToId: 'publication-problem-live-v2', draft: false },
            {
                publicationToId: 'publication-problem-live-2',
                versionToId: 'publication-problem-live-2-v1',
                draft: false
            }
        ]);
    });

    test('Invalid links cannot be created via direct publishing', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '000000013',
                directPublish: 'true'
            })
            .send({
                type: 'PROBLEM',
                title: 'Direct publish by organisational account',
                content: 'Test',
                linkedPublicationIds: ['publication-hypothesis-draft']
            });

        expect(createPublicationRequest.status).toEqual(400);
        expect(createPublicationRequest.body.message).toEqual(
            'Publication with id publication-hypothesis-draft is not LIVE, so a link cannot be created to it.'
        );
    });

    test('Topics are correctly created when provided', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '000000013',
                directPublish: 'true'
            })
            .send({
                type: 'PROBLEM',
                title: 'Direct publish by organisational account',
                content: 'Test',
                topicIds: ['test-topic-1a', 'test-topic-1b']
            });

        expect(createPublicationRequest.status).toEqual(201);
        expect(createPublicationRequest.body.versions[0].topics).toHaveLength(2);
        expect(createPublicationRequest.body.versions[0].topics[0].id).toEqual('test-topic-1a');
        expect(createPublicationRequest.body.versions[0].topics[1].id).toEqual('test-topic-1b');
    });

    test('Invalid topic IDs cannot be passed when direct publishing', async () => {
        const createPublicationRequest = await testUtils.agent
            .post('/publications')
            .query({
                apiKey: '000000013',
                directPublish: 'true'
            })
            .send({
                type: 'PROBLEM',
                title: 'Direct publish by organisational account',
                content: 'Test',
                topicIds: ['made-up-topic-id']
            });

        expect(createPublicationRequest.status).toEqual(400);
        expect(createPublicationRequest.body.message).toEqual('Topic with ID made-up-topic-id not found.');
    });
});
