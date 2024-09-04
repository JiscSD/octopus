import { Prisma } from '@prisma/client';

const userMappings: Prisma.UserMappingCreateManyInput[] = [
    {
        userId: 'test-organisational-account-1',
        value: 'test ari department',
        source: 'ARI'
    },
    {
        userId: 'test-organisational-account-2',
        value: 'test organisation 2',
        source: 'ARI'
    }
];

export default userMappings;
