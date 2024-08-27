import { Prisma } from '@prisma/client';

const userMappings: Prisma.UserMappingCreateManyInput[] = [
    {
        userId: 'test-organisational-account-1',
        value: 'test ari department',
        source: 'ARI'
    }
];

export default userMappings;
