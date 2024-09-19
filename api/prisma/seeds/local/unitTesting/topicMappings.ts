import { Prisma } from '@prisma/client';

const topicMappings: Prisma.TopicMappingCreateManyInput[] = [
    {
        title: 'ari test',
        source: 'ARI',
        topicId: 'test-topic-1a'
    },
    {
        title: 'ari test (unmapped)',
        source: 'ARI',
        isMapped: false
    }
];

export default topicMappings;
