import * as testUtils from 'lib/testUtils';

describe('Create new publication versions', () => {
    beforeEach(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    test('User can create a new publication version from existing LIVE version', async () => {
        const newPublicationVersion = await testUtils.agent
            .post('/publications/publication-data-live/publication-versions')
            .query({
                apiKey: '123456789'
            });

        expect(newPublicationVersion.status).toEqual(201);
        expect(newPublicationVersion.body.currentStatus).toEqual('DRAFT');
    });

    test('All data is inherited from previous version when creating a new version', async () => {
        // get the latest published version
        const oldPublicationVersion = await testUtils.agent
            .get('/publications/publication-data-live/publication-versions/latest')
            .query({
                apiKey: '123456789'
            });

        expect(oldPublicationVersion.status).toEqual(200);
        expect(oldPublicationVersion.body.currentStatus).toEqual('LIVE');
        expect(oldPublicationVersion.body.versionNumber).toEqual(1);

        // create new version for this publication
        const newPublicationVersion = await testUtils.agent
            .post('/publications/publication-data-live/publication-versions')
            .query({
                apiKey: '123456789'
            });

        expect(newPublicationVersion.status).toEqual(201);
        expect(newPublicationVersion.body.currentStatus).toEqual('DRAFT');
        expect(newPublicationVersion.body.versionNumber).toEqual(2);
        expect(newPublicationVersion.body.title).toEqual(oldPublicationVersion.body.title);
        expect(newPublicationVersion.body.content).toEqual(oldPublicationVersion.body.content);
        expect(newPublicationVersion.body.topics.length).toEqual(oldPublicationVersion.body.topics.length);
        expect(newPublicationVersion.body.publication.type).toEqual(oldPublicationVersion.body.publication.type);
    });

    test('User cannot create a new publication version if the latest version is of this publication is DRAFT', async () => {
        const newPublicationVersion = await testUtils.agent
            .post('/publications/publication-data-draft/publication-versions')
            .query({
                apiKey: '123456789'
            });

        expect(newPublicationVersion.status).toEqual(403);
    });

    test('User cannot create a new publication version if they are not an author on the latest version.', async () => {
        const newPublicationVersion = await testUtils.agent
            .post('/publications/publication-data-draft/publication-versions')
            .query({
                apiKey: '000000005'
            });

        expect(newPublicationVersion.status).toEqual(403);
    });

    test('Previous version "isLatestVersion=true" becomes "isLatestVersion=false" when creating a new version', async () => {
        const newPublicationVersion = await testUtils.agent
            .post('/publications/publication-data-live/publication-versions')
            .query({
                apiKey: '123456789'
            });

        expect(newPublicationVersion.status).toEqual(201);
        expect(newPublicationVersion.body.isLatestVersion).toEqual(true);

        const previousPublicationVersion = await testUtils.agent
            .get(
                `/publications/publication-data-live/publication-versions/${
                    newPublicationVersion.body.versionNumber - 1
                }`
            )
            .query({
                apiKey: '123456789'
            });

        expect(previousPublicationVersion.status).toEqual(200);
        expect(previousPublicationVersion.body.isLatestVersion).toEqual(false);
    });
});
