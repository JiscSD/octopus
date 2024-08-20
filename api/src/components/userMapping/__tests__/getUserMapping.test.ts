import * as testUtils from 'lib/testUtils';
import * as userMappingService from 'userMapping/service';

describe('Get a user mapping', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Get a user mapping for a given external user name and source', async () => {
        const getUserMapping = await userMappingService.get('test ARI department', 'ARI');

        expect(getUserMapping).toEqual({
            value: 'test ari department',
            source: 'ARI',
            user: {
                id: 'test-organisational-account-1',
                firstName: 'Test ARI Department (UK)',
                defaultTopicId: 'test-topic-1'
            }
        });
    });

    test('Try to get a nonexistent user mapping', async () => {
        const getUserMapping = await userMappingService.get('unmapped value', 'ARI');

        expect(getUserMapping).toBeNull();
    });
});
