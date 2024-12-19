import * as enums from 'lib/enum';
import * as testUtils from 'lib/testUtils';

describe('Get many publication versions', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
        await testUtils.openSearchSeed();
    });

    test('Pages have 10 results by default', async () => {
        const getPublications = await testUtils.agent.get('/publication-versions');

        expect(getPublications.status).toEqual(200);
        expect(getPublications.body.metadata).toMatchObject({
            limit: 10,
            offset: 0
        });
        expect(getPublications.body.data.length).toEqual(10);
    });

    test('Can limit page size', async () => {
        const getPublications = await testUtils.agent.get('/publication-versions').query({
            limit: 5
        });

        expect(getPublications.status).toEqual(200);
        expect(getPublications.body.metadata).toMatchObject({
            limit: 5
        });
        expect(getPublications.body.data.length).toEqual(5);
    });

    test('Can get second page', async () => {
        const getPublications = await testUtils.agent.get('/publication-versions').query({
            offset: 10
        });

        expect(getPublications.status).toEqual(200);
        expect(getPublications.body.metadata).toMatchObject({
            limit: 10,
            offset: 10
        });
        // This will change if we add more live seed publications.
        expect(getPublications.body.data.length).toEqual(5);
    });

    test('Can order by publication date, descending', async () => {
        const getPublications = await testUtils.agent.get('/publication-versions').query({
            orderBy: 'publishedDate',
            orderDirection: 'desc'
        });

        expect(getPublications.status).toEqual(200);
        const publicationDates = getPublications.body.data.map((version) => version.publishedDate as Date);
        // Sort a copy of the dates from the results to confirm order.
        const sortedPublicationDates = [...publicationDates].sort(
            (a, b) => new Date(b).getTime() - new Date(a).getTime()
        );
        expect(publicationDates).toEqual(sortedPublicationDates);
    });

    test('Can order by publication date, ascending', async () => {
        const getPublications = await testUtils.agent.get('/publication-versions').query({
            orderBy: 'publishedDate',
            orderDirection: 'asc'
        });

        expect(getPublications.status).toEqual(200);
        const publicationDates = getPublications.body.data.map((version) => version.publishedDate as Date);
        // Sort a copy of the dates from the results to confirm order.
        const sortedPublicationDates: Date[] = [...publicationDates].sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
        );
        expect(publicationDates).toEqual(sortedPublicationDates);
    });

    test('Invalid orderBy is rejected', async () => {
        const getPublications = await testUtils.agent.get('/publication-versions').query({
            orderBy: 'dinosaur'
        });

        expect(getPublications.status).toEqual(400);
        expect(getPublications.body.message).toHaveLength(1);
        expect(getPublications.body.message[0].keyword).toEqual('enum');
    });

    test('Invalid order direction is rejected', async () => {
        const getPublications = await testUtils.agent.get('/publication-versions').query({
            orderBy: 'publishedDate',
            orderDirection: 'dinosaur'
        });

        expect(getPublications.status).toEqual(400);
        expect(getPublications.body.message).toHaveLength(1);
        expect(getPublications.body.message[0].keyword).toEqual('enum');
    });

    test('Can filter by publication type', async () => {
        await Promise.all(
            enums.publicationTypes.map(async (type) => {
                const getPublications = await testUtils.agent.get(`/publication-versions?type=${type}`);

                expect(getPublications.status).toEqual(200);
                expect(getPublications.body.data.every((version) => version.publication.type === type)).toEqual(true);
            })
        );
    });

    test('Can filter by multiple publication types at once', async () => {
        const getPublications = await testUtils.agent.get('/publication-versions?type=PROBLEM,PROTOCOL');

        expect(getPublications.status).toEqual(200);
        expect(
            getPublications.body.data.every((version) => ['PROBLEM', 'PROTOCOL'].includes(version.publication.type))
        ).toEqual(true);
    });

    test('Type filtering rejects invalid types', async () => {
        const getPublications = await testUtils.agent.get('/publication-versions?type=DINOSAUR');

        expect(getPublications.status).toEqual(400);
        expect(getPublications.body.message).toHaveLength(1);
        expect(getPublications.body.message[0].keyword).toEqual('pattern');
    });

    test('Can filter by author type', async () => {
        const getOrganisationalPublications = await testUtils.agent.get(
            '/publication-versions?authorType=organisational'
        );

        expect(getOrganisationalPublications.status).toEqual(200);
        // User role isn't returned in body so differentiate results by length (there are fewer organisational publications).
        expect(getOrganisationalPublications.body.data).toHaveLength(2);

        const getIndividualPublications = await testUtils.agent.get('/publication-versions?authorType=individual');

        expect(getIndividualPublications.status).toEqual(200);
        expect(getIndividualPublications.body.data).toHaveLength(10);
    });

    test('Can filter by multiple author types at once', async () => {
        const getPublications = await testUtils.agent.get('/publication-versions?authorType=individual,organisational');

        expect(getPublications.status).toEqual(200);
        // Includes everything.
        expect(getPublications.body.metadata.total).toEqual(15);
    });

    test('Author filtering rejects invalid types', async () => {
        const getPublications = await testUtils.agent.get('/publication-versions?authorType=dinosaur');

        expect(getPublications.status).toEqual(400);
        expect(getPublications.body.message).toHaveLength(1);
        expect(getPublications.body.message[0].keyword).toEqual('pattern');
    });

    test('Can filter by search term', async () => {
        const getPublications = await testUtils.agent.get('/publication-versions?search=ari');

        expect(getPublications.status).toEqual(200);
        expect(getPublications.body.data).toHaveLength(1);
    });

    test('Can filter by date range', async () => {
        const getPublications = await testUtils.agent.get('/publication-versions').query({
            dateFrom: '2024-07-16',
            dateTo: '2024-07-16'
        });

        expect(getPublications.status).toEqual(200);
        expect(getPublications.body.data).toHaveLength(1);
    });

    test('Can exclude a particular publication by its ID', async () => {
        const getAllPublications = await testUtils.agent.get('/publication-versions');
        const allPubsCount = getAllPublications.body.metadata.total;

        const getMostPublications = await testUtils.agent
            .get('/publication-versions')
            .query({ exclude: 'ari-publication-1' });

        expect(getMostPublications.status).toEqual(200);
        expect(getMostPublications.body.metadata.total).toEqual(allPubsCount - 1);
    });
});
