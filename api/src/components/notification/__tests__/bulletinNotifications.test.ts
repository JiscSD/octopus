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

    test('Create bulletin [PUBLICATION_VERSION_LINKED_PREDECESSOR]', async () => {
        const publicationVersion = await testUtils.agent
            .get('/publications/publication-problem-live-2/publication-versions/latest')
            .query({ apiKey: '123456789' });

        const previousPublishedVersion = await publicationVersionService.getPreviousPublishedVersion(
            publicationVersion.body.versionOf
        );

        await notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_VERSION_LINKED_PREDECESSOR,
            publicationVersion.body,
            previousPublishedVersion
        );

        const bulletin = await notificationService.getBulletin(I.NotificationStatusEnum.PENDING);
        const bulletinLinkedParent = bulletin.filter(
            (b) => b.actionType === I.NotificationActionTypeEnum.PUBLICATION_VERSION_LINKED_PREDECESSOR
        );

        expect(bulletinLinkedParent.length).toBe(1);
        expect(bulletinLinkedParent[0].userId).toBe('test-user-1');

        const payload = bulletin[0].payload as I.NotificationPayload;
        expect(payload).toBeDefined();
        expect(payload.url).toBe(Helpers.getPublicationUrl(publicationVersion.body.versionOf));
    });

    test('Create bulletin [PUBLICATION_VERSION_LINKED_SUCCESSOR]', async () => {
        const publicationVersion = await testUtils.agent
            .get('/publications/publication-problem-live-2/publication-versions/latest')
            .query({ apiKey: '123456789' });

        const previousPublishedVersion = await publicationVersionService.getPreviousPublishedVersion(
            publicationVersion.body.versionOf
        );

        if (!previousPublishedVersion) {
            throw new Error('Previous published version not found');
        }

        await notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_VERSION_LINKED_SUCCESSOR,
            publicationVersion.body,
            previousPublishedVersion
        );

        const bulletin = await notificationService.getBulletin(I.NotificationStatusEnum.PENDING);
        const bulletinLinkedParent = bulletin.filter(
            (b) => b.actionType === I.NotificationActionTypeEnum.PUBLICATION_VERSION_LINKED_SUCCESSOR
        );

        expect(bulletinLinkedParent.length).toBe(2);
        expect(bulletinLinkedParent[0].userId).toBe('test-user-1');
        expect(bulletinLinkedParent[1].userId).toBe('test-user-5');

        const firstPayload = bulletinLinkedParent[0].payload as I.NotificationPayload;
        expect(firstPayload).toBeDefined();
        expect(firstPayload.url).toBe(Helpers.getPublicationUrl(previousPublishedVersion.versionOf));

        const secondPayload = bulletinLinkedParent[1].payload as I.NotificationPayload;
        expect(secondPayload).toBeDefined();
        expect(secondPayload.url).toBe(Helpers.getPublicationUrl(previousPublishedVersion.versionOf));
    });

    test('sendAll - passing', async () => {
        const publicationVersion = await testUtils.agent
            .get('/publications/publication-problem-live/publication-versions/latest')
            .query({ apiKey: '123456789' });

        const previousPublishedVersion = await publicationVersionService.getPreviousPublishedVersion(
            publicationVersion.body.versionOf
        );

        await notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_VERSION_CREATED,
            publicationVersion.body,
            previousPublishedVersion
        );

        await notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_RED_FLAG_RAISED,
            publicationVersion.body,
            previousPublishedVersion
        );

        await notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_RED_FLAG_RESOLVED,
            publicationVersion.body,
            previousPublishedVersion
        );

        await notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_BOOKMARK_RED_FLAG_COMMENTED,
            publicationVersion.body,
            previousPublishedVersion
        );

        await notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_VERSION_RED_FLAG_RAISED,
            publicationVersion.body,
            previousPublishedVersion
        );

        await notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_VERSION_PEER_REVIEWED,
            publicationVersion.body,
            previousPublishedVersion
        );

        await notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_VERSION_LINKED_PREDECESSOR,
            publicationVersion.body,
            previousPublishedVersion
        );

        await notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_VERSION_LINKED_SUCCESSOR,
            publicationVersion.body,
            previousPublishedVersion
        );

        const sentResponse = await notificationBulletin.sendAll(true);

        expect(sentResponse).toBeDefined();
        expect(sentResponse.errors.length).toBe(0);
        expect(sentResponse.totalSent).toBe(7);
    });

    test('sendAll - failing', async () => {
        const publicationVersion = await testUtils.agent
            .get('/publications/publication-hypothesis-draft-problem-live/publication-versions/latest')
            .query({ apiKey: '123456789' });

        await notificationBulletin.createBulletin(
            I.NotificationActionTypeEnum.PUBLICATION_VERSION_LINKED_PREDECESSOR,
            publicationVersion.body,
            publicationVersion.body
        );

        // expecting this to fail as there is a link between "publication-hypothesis-draft-problem-live" and "ari-publication-1-v1"
        // where "ari-publication-1-v1" belongs to "test-organisational-account-1" - user that doesn't have an email

        const sentResponse = await notificationBulletin.sendAll(true);

        expect(sentResponse).toBeDefined();
        expect(sentResponse.errors.length).toBe(1);
        expect(sentResponse.errors[0].message).toBe(
            `User with ID test-organisational-account-1 does not exist or has no email.`
        );
        expect(sentResponse.totalFailed).toBe(1);
    });
});
