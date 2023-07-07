import * as testUtils from 'lib/testUtils';

describe.only('Create topic', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Create a minimal topic', async () => {
        const createTopicRequest = await testUtils.agent
            .post('/topics')
            .query({
                apiKey: 'kjahskjhuhaushkjhaskjhjkahsd' // Science Octopus
            })
            .send({
                title: 'Topic test 1',
                parentId: 'test-topic-1'
            });

        expect(createTopicRequest.status).toEqual(201);
        expect(createTopicRequest.body.title).toEqual('Topic test 1');
    });
});
