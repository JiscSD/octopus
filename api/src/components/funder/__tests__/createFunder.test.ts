import * as testUtils from 'lib/testUtils';

describe('create a funder', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can add a funder to their DRAFT publication version', async () => {
        const funder = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/funders')
            .query({ apiKey: '000000005' })
            .send({
                name: 'Example name',
                city: 'Example city',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(funder.status).toEqual(200);
    });
    test('User cannot add a funder to their LIVE publication version', async () => {
        const funder = await testUtils.agent
            .post('/publication-versions/publication-problem-live-v1/funders')
            .query({ apiKey: '123456789' })
            .send({
                name: 'Example name',
                city: 'Example city',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(funder.status).toEqual(400);
    });
    test('User cannot add a funder to another DRAFT publication version', async () => {
        const funder = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/funders')
            .query({ apiKey: '987654321' })
            .send({
                name: 'Example name',
                city: 'Example city',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(funder.status).toEqual(403);
    });
    test('User cannot add a funder to another LIVE publication version', async () => {
        const funder = await testUtils.agent
            .post('/publication-versions/publication-problem-live-v1/funders')
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
            .post('/publication-versions/publication-problem-draft-v1/funders')
            .query({ apiKey: '000000005' })
            .send({
                city: 'Example city',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(funder.status).toEqual(400);
    });
    test('User must send correct information to create a funder (no city)', async () => {
        const funder = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/funders')
            .query({ apiKey: '000000005' })
            .send({
                name: 'Example name',
                country: 'Example country',
                link: 'https://jisc.ac.uk'
            });

        expect(funder.status).toEqual(400);
    });
    test('User must send correct information to create a funder (no country)', async () => {
        const funder = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/funders')
            .query({ apiKey: '000000005' })
            .send({
                name: 'Example name',
                city: 'Example city',
                link: 'https://jisc.ac.uk'
            });

        expect(funder.status).toEqual(400);
    });
    test('User must send correct information to create a funder (no link)', async () => {
        const funder = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/funders')
            .query({ apiKey: '000000005' })
            .send({
                name: 'Example name',
                city: 'Example city',
                country: 'Example country'
            });

        expect(funder.status).toEqual(400);
    });
    test('User can create a duplicate funder if grant ID is different', async () => {
        const funder = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/funders')
            .query({ apiKey: '000000005' })
            .send({
                name: 'name',
                country: 'country',
                city: 'city',
                link: 'https://example.com',
                grantId: 'new-grant-id'
            });

        expect(funder.status).toEqual(200);
    });
    test('User cannot create a duplicate funder if no grant ID is supplied', async () => {
        const funder = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/funders')
            .query({ apiKey: '000000005' })
            .send({
                name: 'name',
                country: 'country',
                city: 'city',
                link: 'https://example.com'
            });

        expect(funder.status).toEqual(400);
        expect(funder.body.message).toEqual('This funder already exists on this publication version.');
    });
    test('User cannot create a duplicate funder if the existing funder has no grant ID', async () => {
        const funder = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/funders')
            .query({ apiKey: '000000005' })
            .send({
                name: 'Example Funder',
                country: 'United Kingdom',
                city: 'London',
                link: 'https://examplefunder.com'
            });

        expect(funder.status).toEqual(400);
        expect(funder.body.message).toEqual('This funder already exists on this publication version.');
    });
    test('User cannot create a duplicate funder with the same grant ID', async () => {
        const funder = await testUtils.agent
            .post('/publication-versions/publication-problem-draft-v1/funders')
            .query({ apiKey: '000000005' })
            .send({
                name: 'name',
                country: 'country',
                city: 'city',
                link: 'https://example.com',
                grantId: 'testing-co-12345'
            });

        expect(funder.status).toEqual(400);
        expect(funder.body.message).toEqual(
            'This funder and grant identifier already exist on this publication version.'
        );
    });
});
