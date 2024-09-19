import * as testUtils from 'lib/testUtils';

describe.only('Create topic', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Create a topic as a real user', async () => {
        const createTopicRequest = await testUtils.agent
            .post('/topics')
            .query({
                apiKey: 'kjahskjhuhaushkjhaskjhjkahsd' // Science Octopus
            })
            .send({
                title: 'Topic test 1',
                parentIds: ['test-topic-1'],
                language: 'en',
                translations: [
                    {
                        language: 'fr',
                        value: 'a french name'
                    },
                    {
                        language: 'de',
                        value: 'a german name'
                    }
                ]
            });

        expect(createTopicRequest.status).toEqual(201);
        expect(createTopicRequest.body.title).toEqual('Topic test 1');
        expect(createTopicRequest.body.language).toEqual('en');
        expect(createTopicRequest.body.translations.length).toEqual(2);
    });

    test('Attempt to create a minimal topic as an anonymous user', async () => {
        const createTopicRequest = await testUtils.agent
            .post('/topics')
            .query({
                apiKey: 'not-related-to-a-user'
            })
            .send({
                title: 'Anon user topic',
                parentIds: ['test-topic-1']
            });

        expect(createTopicRequest.status).toEqual(401);
    });

    test('Attempt to create a topic without supplying at least 1 parent ID', async () => {
        const createTopicRequest = await testUtils.agent
            .post('/topics')
            .query({
                apiKey: 'kjahskjhuhaushkjhaskjhjkahsd'
            })
            .send({
                title: 'Orphan topic',
                parentIds: []
            });

        expect(createTopicRequest.status).toEqual(400);
    });
});
