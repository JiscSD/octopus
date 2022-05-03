import * as testUtils from 'lib/testUtils';

describe('Get aggregate publication ratings', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('Get all aggregate ratings for a publication', async () => {
        const publication = await testUtils.agent.get('/publications/publication-problem-live');

        expect(publication.body.ratings.aggregate.sort()).toMatchObject(
            [
                {
                    _count: { id: 2 },
                    _avg: { rating: 7 },
                    category: 'PROBLEM_IMPORTANT',
                    publicationId: 'publication-problem-live'
                },
                {
                    _count: { id: 2 },
                    _avg: { rating: 6 },
                    category: 'PROBLEM_WELL_DEFINED',
                    publicationId: 'publication-problem-live'
                },
                {
                    _count: { id: 2 },
                    _avg: { rating: 9 },
                    category: 'PROBLEM_ORIGINAL',
                    publicationId: 'publication-problem-live'
                }
            ].sort()
        );

        expect(publication.body.ratings.overall).toMatchObject({
            _avg: { rating: 7.333333333333333 },
            _count: { rating: 6 }
        });
    });

    test('Get all aggregate ratings for a publication (auth)', async () => {
        const publication = await testUtils.agent
            .get('/publications/publication-problem-live')
            .query({ apiKey: '123456789' });

        expect(publication.body.ratings.aggregate.sort()).toMatchObject(
            [
                {
                    _count: { id: 2 },
                    _avg: { rating: 7 },
                    category: 'PROBLEM_IMPORTANT',
                    publicationId: 'publication-problem-live'
                },
                {
                    _count: { id: 2 },
                    _avg: { rating: 6 },
                    category: 'PROBLEM_WELL_DEFINED',
                    publicationId: 'publication-problem-live'
                },
                {
                    _count: { id: 2 },
                    _avg: { rating: 9 },
                    category: 'PROBLEM_ORIGINAL',
                    publicationId: 'publication-problem-live'
                }
            ].sort()
        );

        expect(publication.body.ratings.overall).toMatchObject({
            _avg: { rating: 7.333333333333333 },
            _count: { rating: 6 }
        });
    });

    test('Get all aggregate ratings for a publication (only 2 categories exist)', async () => {
        const publication = await testUtils.agent.get('/publications/publication-hypothesis-live');

        expect(publication.body.ratings.aggregate).toMatchObject([
            {
                _count: { id: 2 },
                _avg: { rating: 9 },
                category: 'HYPOTHESIS_ORIGINAL',
                publicationId: 'publication-hypothesis-live'
            },
            {
                _count: { id: 2 },
                _avg: { rating: 6 },
                category: 'HYPOTHESIS_WELL_DEFINED',
                publicationId: 'publication-hypothesis-live'
            }
        ]);

        expect(publication.body.ratings.overall).toMatchObject({
            _avg: { rating: 7.5 },
            _count: { rating: 4 }
        });
    });

    test('Get all aggregate ratings for a publication (no ratings exist)', async () => {
        const publication = await testUtils.agent.get('/publications/publication-data-live');

        expect(publication.body.ratings.aggregate).toMatchObject([]);

        expect(publication.body.ratings.overall).toMatchObject({});
    });
});
