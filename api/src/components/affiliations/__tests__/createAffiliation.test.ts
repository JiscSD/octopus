import * as testUtils from 'lib/testUtils';

describe('create a affiliation', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.initialSeed();
    });

    test('User can add an affiliation to their DRAFT publication', async () => {
        const affiliation = await testUtils.agent
            .post('/publications/publication-problem-draft/affiliation')
            .query({ apiKey: '123456789' })
            .send({
                name: 'Example name',
                city: 'Example city',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(affiliation.status).toEqual(200);
    });
    test('User cannot add an affiliation to their LIVE publication', async () => {
        const affiliation = await testUtils.agent
            .post('/publications/publication-problem-live/affiliation')
            .query({ apiKey: '123456789' })
            .send({
                name: 'Example name',
                city: 'Example city',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(affiliation.status).toEqual(403);
    });
    test('User cannot add an affiliation to another users DRAFT publication', async () => {
        const affiliation = await testUtils.agent
            .post('/publications/publication-problem-draft/affiliation')
            .query({ apiKey: '987654321' })
            .send({
                name: 'Example name',
                city: 'Example city',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(affiliation.status).toEqual(403);
    });
    test('User cannot add an affiliation to another LIVE publication', async () => {
        const affiliation = await testUtils.agent
            .post('/publications/publication-problem-live/affiliation')
            .query({ apiKey: '987654321' })
            .send({
                name: 'Example name',
                city: 'Example city',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(affiliation.status).toEqual(403);
    });
    test('User must send correct information to create an affiliation (no name)', async () => {
        const affiliation = await testUtils.agent
            .post('/publications/publication-problem-draft/affiliation')
            .query({ apiKey: '123456789' })
            .send({
                city: 'Example city',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(affiliation.status).toEqual(422);
    });
    test('User must send correct information to create an affiliation (no city)', async () => {
        const affiliation = await testUtils.agent
            .post('/publications/publication-problem-draft/affiliation')
            .query({ apiKey: '123456789' })
            .send({
                name: 'Example name',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(affiliation.status).toEqual(422);
    });
    test('User must send correct information to create an affiliation (no country)', async () => {
        const affiliation = await testUtils.agent
            .post('/publications/publication-problem-draft/affiliation')
            .query({ apiKey: '123456789' })
            .send({
                name: 'Example name',
                city: 'Example city',
                link: 'https://jisc.ac.uk'
            });

        expect(affiliation.status).toEqual(422);
    });
    test('User must send correct information to create an affiliation (no link)', async () => {
        const affiliation = await testUtils.agent
            .post('/publications/publication-problem-draft/affiliation')
            .query({ apiKey: '123456789' })
            .send({
                name: 'Example name',
                city: 'Example city',
                country: 'Example country'
            });

        expect(affiliation.status).toEqual(422);
    });
});
