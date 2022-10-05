import * as testUtils from 'lib/testUtils';

describe('update all references', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can update all references from their own draft publication', async () => {
        const reference = await testUtils.agent
            .put('/publications/publication-interpretation-draft/reference')
            .query({ apiKey: '123456789' })
            .send([
                {
                    id: '04',
                    location: 'http://octopus.ac',
                    publicationId: 'publication-interpretation-draft',
                    text: '<p>Reference 1</p>',
                    type: 'TEXT'
                }
            ]);

        expect(reference.status).toEqual(200);
    });

    test('User must be the author of the publication to update the references', async () => {
        const reference = await testUtils.agent
            .put('/publications/publication-interpretation-draft/reference')
            .query({ apiKey: '987654321' })
            .send([
                {
                    id: '04',
                    location: 'http://octopus.ac',
                    publicationId: 'publication-problem-draft',
                    text: '<p>Reference 1</p>',
                    type: 'TEXT'
                }
            ]);

        expect(reference.status).toEqual(403);
    });

    test('The author can only update the references for a draft publication', async () => {
        const reference = await testUtils.agent
            .put('/publications/publication-real-world-application-live/reference')
            .query({ apiKey: '123456789' })
            .send([
                {
                    id: '04',
                    location: 'http://octopus.ac',
                    publicationId: 'publication-real-world-application-live',
                    text: '<p>Reference 1</p>',
                    type: 'TEXT'
                }
            ]);

        expect(reference.status).toEqual(403);
    });

    test('All of the references should be replaced with the new references ', async () => {
        const newReferencesArray = [
            {
                id: '04',
                location: 'http://octopus.ac',
                publicationId: 'publication-interpretation-draft',
                text: '<p>Reference 1</p>',
                type: 'TEXT'
            },
            {
                id: '05',
                location: 'http://google.com',
                publicationId: 'publication-interpretation-draft',
                text: '<p>Reference 2</p>',
                type: 'TEXT'
            }
        ];

        const reference = await testUtils.agent
            .put('/publications/publication-interpretation-draft/reference')
            .query({ apiKey: '123456789' })
            .send(newReferencesArray);

        const checkReference = await testUtils.agent.get('/publications/publication-interpretation-draft/reference');

        expect(reference.body.count).toEqual(2);
        expect(checkReference.body).toEqual(newReferencesArray);
    });
});
