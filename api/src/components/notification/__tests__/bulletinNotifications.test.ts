import * as I from 'interface';
import * as testUtils from 'lib/testUtils';
import * as Helpers from 'lib/helpers';
import * as notificationBulletin from 'notification/bulletin';
import * as notificationService from 'notification/service';
import * as publicationVersionService from 'publicationVersion/service';

describe('Bulletin notifications', () => {
    beforeAll(async () => {
        await testUtils.clearDB();
        await testUtils.testSeed();
    });

    afterEach(async () => {
        const bulletin = await notificationService.getBulletin();
        await notificationService.removeMany(bulletin.map((b) => b.id));
    });

    test('Create bulletin [PUBLICATION_BOOKMARK_VERSION_CREATED]', async () => {
        const publicationVersion = await testUtils.agent
            .get('/publications/publication-problem-live/publication-versions/latest')
            .query({ apiKey: '123456789' });

        await notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_VERSION_CREATED,
            publicationVersion.body,
            null
        );

        let bulletin = await notificationService.getBulletin(I.NotificationStatusEnum.PENDING);
        bulletin = bulletin.filter(
            (b) => b.actionType === I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_VERSION_CREATED
        );

        expect(bulletin.length).toBe(1);
        expect(bulletin[0].userId).toBe('test-user-2');

        const payload = bulletin[0].payload as I.NotificationPayload;
        expect(payload).toBeDefined();
        expect(payload.url).toBe(Helpers.getPublicationUrl(publicationVersion.body.versionOf));
        expect(payload.title).toBe(publicationVersion.body.title);
    });

    test('Create bulletin [PUBLICATION_BOOKMARK_VERSION_CREATED] with excluded userIds', async () => {
        const publicationVersion = await testUtils.agent
            .get('/publications/publication-problem-live/publication-versions/latest')
            .query({ apiKey: '123456789' });

        await notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_VERSION_CREATED,
            publicationVersion.body,
            null,
            { excludedUserIds: ['test-user-2'] }
        );

        let bulletin = await notificationService.getBulletin(I.NotificationStatusEnum.PENDING);
        bulletin = bulletin.filter(
            (b) => b.actionType === I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_VERSION_CREATED
        );

        expect(bulletin.length).toBe(0);
    });

    test('Create bulletin [PUBLICATION_VERSION_RED_FLAG_RAISED]', async () => {
        // Create a new version so that the prev version (that has the flag) can be tested
        await testUtils.agent
            .post('/publications/publication-problem-live/publication-versions')
            .query({ apiKey: '123456789' });

        const publicationVersion = await testUtils.agent
            .get('/publications/publication-problem-live/publication-versions/latest')
            .query({ apiKey: '123456789' });

        const previousPublishedVersion = await publicationVersionService.getPreviousPublishedVersion(
            publicationVersion.body.versionOf
        );

        await notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_VERSION_RED_FLAG_RAISED,
            publicationVersion.body,
            previousPublishedVersion
        );

        let bulletin = await notificationService.getBulletin(I.NotificationStatusEnum.PENDING);
        bulletin = bulletin.filter(
            (b) => b.actionType === I.NotificationActionTypeEnum.PUBLICATION_VERSION_RED_FLAG_RAISED
        );

        expect(bulletin.length).toBe(1);
        expect(bulletin[0].userId).toBe('test-user-2');

        const payload = bulletin[0].payload as I.NotificationPayload;
        expect(payload).toBeDefined();
        expect(payload.url).toBe(Helpers.getPublicationUrl(publicationVersion.body.versionOf));
        expect(payload.title).toBe(publicationVersion.body.title);
    });

    test('Create bulletin [PUBLICATION_VERSION_PEER_REVIEWED]', async () => {
        const publicationVersion = await testUtils.agent
            .get('/publications/publication-problem-live-2/publication-versions/latest')
            .query({ apiKey: '123456789' });

        await testUtils.agent.put(`/publication-versions/${publicationVersion.body.id}/status/LIVE`).query({
            apiKey: '123456789'
        });

        const bulletin = await notificationService.getBulletin(I.NotificationStatusEnum.PENDING);
        const bulletinPeerReviewed = bulletin.filter(
            (b) => b.actionType === I.NotificationActionTypeEnum.PUBLICATION_VERSION_PEER_REVIEWED
        );

        expect(bulletinPeerReviewed.length).toBe(2);
        expect(bulletinPeerReviewed[0].userId).toBe('test-user-1');
        expect(bulletinPeerReviewed[1].userId).toBe('test-user-10');

        const firstPayload = bulletinPeerReviewed[0].payload as I.NotificationPayload;
        expect(firstPayload).toBeDefined();
        expect(firstPayload.url).toBe(Helpers.getPublicationUrl(publicationVersion.body.versionOf));
        expect(firstPayload.title).toBe(publicationVersion.body.title);

        const secondPayload = bulletinPeerReviewed[1].payload as I.NotificationPayload;
        expect(secondPayload).toBeDefined();
        expect(secondPayload.url).toBe(Helpers.getPublicationUrl(publicationVersion.body.versionOf));
        expect(secondPayload.title).toBe(publicationVersion.body.title);
    });

    test('Create bulletin [PUBLICATION_VERSION_LINKED_PARENT]', async () => {});

    test('Create bulletin [PUBLICATION_VERSION_LINKED_CHILD]', async () => {});
});
