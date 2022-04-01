import * as testUtils from 'lib/testUtils';
import * as client from 'lib/client';

//                      TEST IDEAS:  
// - User can leave a review on another user’s publication 
// - User cannot leave a review on their own publication 
// - User needs to be authenticated to leave a review 
// - Publication needs to exist for user to leave a review 
// - Rating value cannot be less than 0 or more than 10 
// - Must be a valid rating category based on the publication type
// - If the publication is in draft state we cannot leave a review

describe('Create publication ratings', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });
    
    test('User can leave a review on another users publication', async () => {
        const createRatingRequest = await testUtils.agent
            .post('/publications/publication-problem-live/ratings')
            .query({
                apiKey: '987654321'
            })
            .send({
                type: 'PROBLEM_ORIGINAL',
                value: '1'
            });

        expect(createRatingRequest.status).toEqual(200);
    });

    test('User cannot leave a review on their own publication', async () => {
        const createRatingRequest = await testUtils.agent
        .post('/publications/publication-problem-live/ratings')
        .query({
            apiKey: '123456789'
        })
        .send({
            type: 'PROBLEM_ORIGINAL',
            value: '1'
        });

        expect(createRatingRequest.status).toEqual(403);
    });

    test('User needs to be authenticated to leave a review', async () => {
        const createRatingRequest = await testUtils.agent
            .post('/publications/publication-problem-live/ratings')
            .query({
                apiKey: null
            })
            .send({
                type: 'PROBLEM_ORIGINAL',
                value: '1'
            });

        expect(createRatingRequest.status).toEqual(401);
    });

    test('Publication needs to exist for user to leave a review', async () => {
        const createRatingRequest = await testUtils.agent
            .post('/publications/publication-that-does-not-exist/ratings')
            .query({
                apiKey: '987654321'
            })
            .send({
                type: 'PROBLEM_ORIGINAL',
                value: '1'
            });

        expect(createRatingRequest.status).toEqual(404);
    });

    test('Rating value cannot be more than 10', async () => {
        const createRatingRequest = await testUtils.agent
            .post('/publications/publication-problem-live/ratings')
            .query({
                apiKey: '987654321'
            })
            .send({
                type: 'PROBLEM_ORIGINAL',
                value: '111'
            });

        expect(createRatingRequest.status).toEqual(422);
    });

    test('Rating value cannot be less than 0', async () => {
        const createRatingRequest = await testUtils.agent
            .post('/publications/publication-problem-live/ratings')
            .query({
                apiKey: '987654321'
            })
            .send({
                type: 'PROBLEM_ORIGINAL',
                value: '-54'
            });

        expect(createRatingRequest.status).toEqual(422);
    });

    test('Must be a valid rating category based on the publication type', async () => {
        const createRatingRequest = await testUtils.agent
            .post('/publications/publication-problem-live/ratings')
            .query({
                apiKey: '987654321'
            })
            .send({
                type: 'INVALID_TYPE',
                value: '6'
            });

        expect(createRatingRequest.status).toEqual(422);
    });

    test('If the publication is in draft state we cannot leave a review', async () => {
        const createRatingRequest = await testUtils.agent
            .post('/publications/publication-problem-draft/ratings')
            .query({
                apiKey: '987654321'
            })
            .send({
                type: 'PROBLEM_ORIGINAL',
                value: '6'
            });

        expect(createRatingRequest.status).toEqual(404);
    });

    test('User leaves a review, then changes it. The DB only stores the latest', async () => {
        await testUtils.agent
            .post('/publications/publication-problem-live/ratings')
            .query({
                apiKey: '987654321'
            })
            .send({
                type: 'PROBLEM_ORIGINAL',
                value: '1'
            });

        await testUtils.agent
            .post('/publications/publication-problem-live/ratings')
            .query({
                apiKey: '987654321'
            })
            .send({
                type: 'PROBLEM_ORIGINAL',
                value: '8'
            });

        const checkForRating = await client.prisma.publicationRatings.findFirst({
            where: {
                id: 'publication-problem-live-test-user-2-PROBLEM_ORIGINAL'
            }
        });

        expect(checkForRating?.rating).toEqual(8)
    });

});