import * as testUtils from 'lib/testUtils';

describe('create a funder', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can add a funder to their DRAFT publication', async () => {
        const funder = await testUtils.agent
            .post('/publications/publication-problem-draft/funders')
            .query({ apiKey: '000000005' })
            .send({
                name: 'Example name',
                city: 'Example city',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(funder.status).toEqual(200);
    });
    test('User cannot add a funder to their LIVE publication', async () => {
        const funder = await testUtils.agent
            .post('/publications/publication-problem-live/funders')
            .query({ apiKey: '123456789' })
            .send({
                name: 'Example name',
                city: 'Example city',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(funder.status).toEqual(403);
    });
    test('User cannot add a funder to another DRAFT publication', async () => {
        const funder = await testUtils.agent
            .post('/publications/publication-problem-draft/funders')
            .query({ apiKey: '987654321' })
            .send({
                name: 'Example name',
                city: 'Example city',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(funder.status).toEqual(403);
    });
    test('User cannot add a funder to another LIVE publication', async () => {
        const funder = await testUtils.agent
            .post('/publications/publication-problem-live/funders')
            .query({ apiKey: '987654321' })
            .send({
                name: 'Example name',
                city: 'Example city',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(funder.status).toEqual(403);
    });
    test('User must send correct information to create a funder (no name)', async () => {
        const funder = await testUtils.agent
            .post('/publications/publication-problem-draft/funders')
            .query({ apiKey: '000000005' })
            .send({
                city: 'Example city',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(funder.status).toEqual(422);
    });
    test('User must send correct information to create a funder (no city)', async () => {
        const funder = await testUtils.agent
            .post('/publications/publication-problem-draft/funders')
            .query({ apiKey: '000000005' })
            .send({
                name: 'Example name',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(funder.status).toEqual(422);
    });
    test('User must send correct information to create a funder (no country)', async () => {
        const funder = await testUtils.agent
            .post('/publications/publication-problem-draft/funders')
            .query({ apiKey: '000000005' })
            .send({
                name: 'Example name',
                city: 'Example city',
                link: 'https://jisc.ac.uk'
            });

        expect(funder.status).toEqual(422);
    });
    test('User must send correct information to create a funder (no link)', async () => {
        const funder = await testUtils.agent
            .post('/publications/publication-problem-draft/funders')
            .query({ apiKey: '000000005' })
            .send({
                name: 'Example name',
                city: 'Example city',
                country: 'Example country'
            });

        expect(funder.status).toEqual(422);
    });
});
