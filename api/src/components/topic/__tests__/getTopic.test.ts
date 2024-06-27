import * as testUtils from 'lib/testUtils';
import * as topicService from 'topic/service';

describe('Get individual topic', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Anonymous user can get an existing topic', async () => {
        const getTopic = await testUtils.agent.get('/topics/test-topic-1');

        expect(getTopic.status).toEqual(200);
        expect(getTopic.body.title).toEqual('Test topic');
    });

    test('Getting non-existent ID returns 404', async () => {
        const getTopic = await testUtils.agent.get('/topics/this-does-not-exist');

        expect(getTopic.status).toEqual(404);
    });

    test('Topic can be retrieved by its ARI title', async () => {
        const getTopic = await topicService.getByMapping('ari test', 'ARI');

        expect(getTopic?.title).toEqual('Test topic');
    });
});
