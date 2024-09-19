import * as testUtils from 'lib/testUtils';
import * as I from 'lib/interface';

describe('Get Topics', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('Get paginated topics', async () => {
        const response = await testUtils.agent.get('/topics');
        expect(response.status).toEqual(200);
        expect(response.body.offset).toEqual(0);
        expect(response.body.limit).toEqual(10);
        expect(response.body.total).toBeGreaterThan(0);
        expect(response.body.results.length).toBeGreaterThan(0);
    });

    test('Get topics filtered by searchTerm', async () => {
        const response = await testUtils.agent.get('/topics?search=test');
        expect(response.status).toEqual(200);
        expect(
            (response.body as I.TopicsPaginatedResults).results.every((topic) =>
                topic.title.toLowerCase().includes('test')
            )
        ).toBe(true);
    });

    test('Get first 2 topics', async () => {
        const response = await testUtils.agent.get('/topics?offset=0&limit=2');
        expect(response.status).toEqual(200);
        expect((response.body as I.TopicsPaginatedResults).results.length).toEqual(2);
    });

    test('Get topics starting at position 2', async () => {
        const response = await testUtils.agent.get('/topics?offset=2');
        expect(response.status).toEqual(200);
        expect((response.body as I.TopicsPaginatedResults).offset).toEqual(2);
    });
});
