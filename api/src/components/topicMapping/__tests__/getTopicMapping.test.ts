import * as testUtils from 'lib/testUtils';
import * as topicMappingService from 'topicMapping/service';

describe('Get a topic mapping', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Get a topic mapping for a given external topic name and source', async () => {
        const getTopicMapping = await topicMappingService.get('Ari Test', 'ARI');

        expect(getTopicMapping).toEqual({
            title: 'ari test',
            source: 'ARI',
            isMapped: true,
            topic: {
                id: 'test-topic-1a',
                title: 'Test sub-topic A'
            }
        });
    });

    test('Get an unmapped topic mapping', async () => {
        const getTopicMapping = await topicMappingService.get('Ari Test (unmapped)', 'ARI');

        expect(getTopicMapping).toEqual({
            title: 'ari test (unmapped)',
            source: 'ARI',
            isMapped: false,
            topic: null
        });
    });

    test('Try to get a nonexistent topic mapping', async () => {
        const getTopicMapping = await topicMappingService.get('unmapped title', 'ARI');

        expect(getTopicMapping).toBeNull();
    });
});
