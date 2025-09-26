import { Browser, expect, Page, request, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

const BULLETIN_SUBJECT =
    'There has been activity on one or more Octopus publications that you have published or bookmarked';

const bookmarkPublication = async (page: Page) => {
    await expect(page.locator(PageModel.livePublication.addBookmark)).toBeVisible();
    await page.locator(PageModel.livePublication.addBookmark).click();
    await page.waitForResponse(
        (res) => res.request().method() === 'POST' && res.url().includes('/bookmarks') && res.ok()
    );
};

const createLivePublication = async (page: Page, title: string) => {
    const url = await Helpers.publicationCreation.createLivePublication(page, title);
    const pathName = url.split('/').slice(3).join('/');
    return { url, pathName };
};

const reVersionPublication = async (page: Page) => {
    await page.locator(PageModel.livePublication.versionsDropdown.createNewVersionButton).click();
    await page.locator('button[title="Confirm"]').click();
    await page.locator(PageModel.publish.publishButton).click();
    await page.locator(PageModel.publish.confirmPublishButton).click();
    await page.waitForURL('/publications/**/versions/latest');
};

const redFlagPublication = async (page: Page) => {
    await expect(page.locator(PageModel.livePublication.flagConcern).locator('visible=true')).toBeVisible();
    await page.locator(PageModel.livePublication.flagConcern).locator('visible=true').click();
    await page.locator(PageModel.livePublication.redFlagComment).click();
    await page.keyboard.type('This is a test red flag comment');
    await page.locator(PageModel.livePublication.redFlagSubmit).click();
    await page.waitForResponse((res) => res.request().method() === 'POST' && res.url().includes('/flags') && res.ok());
};

const sendBulletin = async () => {
    const sendBulletinUrl = new URL(`${process.env.API_BASE}/notifications/bulletin`);
    sendBulletinUrl.searchParams.append('apiKey', process.env.TRIGGER_SCRIPT_API_KEY);
    sendBulletinUrl.searchParams.append('force', 'true');
    await fetch(sendBulletinUrl.toString(), { method: 'POST' });
};

const checkEmail = async (browser: Browser, userEmail: string, expectedSubject: string, expectedText: string) => {
    const context = await browser.newContext();
    const [page] = await Promise.all([context.waitForEvent('page'), context.newPage()]);
    await page.goto(Helpers.constants.MAILPIT);
    await page.waitForSelector('#message-page');
    const message = page.locator(`.message:has-text("${userEmail}")`, { hasText: expectedSubject }).first();
    await expect(message).toBeVisible();
    await message.click();
    await expect(page.frameLocator('iframe').getByText(expectedText)).toBeVisible();
    await page.close();
};

const writeLinkedPublication = async (page: Page, title: string) => {
    await page.locator(PageModel.publish.title).click();
    await page.keyboard.type(title);
    await page.locator(PageModel.publish.confirmPublicationType).click();
    await page.locator(PageModel.publish.createThisPublicationButton).click();
    await Helpers.publicationCreation.completeKeyInformationTab(page);
    await Helpers.publicationCreation.completeAffiliationsTab(page, true);
    await page.locator(PageModel.publish.nextButton).click();
    await Helpers.publicationCreation.completeMainTextTabMinimally(page, 'Testing');
    await Helpers.publicationCreation.completeConflictOfInterestTab(page, false);
    await page.locator(PageModel.publish.publishButton).click();
    await Promise.all([
        page.waitForURL('**/versions/latest'),
        page.locator(PageModel.publish.confirmPublishButton).click()
    ]);
};

test.describe('Notifications', () => {
    const user1PublicationTitle = 'Test Publication for Notifications';
    let user1Page: Page;
    let user1PublicationPathName: string;
    let user1PublicationURL = '';

    test.beforeAll('BEFORE ALL', async ({ browser }) => {
        // User 1 creates a publication
        user1Page = await Helpers.users.getPageAsUser(browser, Helpers.users.user1);
        const user1Publication = await createLivePublication(user1Page, user1PublicationTitle);
        user1PublicationPathName = user1Publication.pathName;
        user1PublicationURL = user1Publication.url;
    });

    test('Toggle notification settings', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await page.goto('/notifications');

        expect(page.getByText('Notification settings')).toBeVisible();

        const bookmarks = page.getByLabel('Receive notifications for bookmarked publications');
        const bookmarksVersion = page.getByLabel('Receive notifications about new versions of bookmarked publications');
        const bookmarksFlag = page.getByLabel('Receive notifications about red flags on bookmarked publications');

        // Initial state - all should be checked
        expect(bookmarks).toBeChecked();
        expect(bookmarksVersion).toBeChecked();
        expect(bookmarksFlag).toBeChecked();

        bookmarks.click();
        expect(page.getByText('Notifications settings updated successfully')).toBeVisible();

        // Parent + child checkboxes should be unchecked
        expect(bookmarks).not.toBeChecked();
        expect(bookmarksVersion).not.toBeChecked();
        expect(bookmarksFlag).not.toBeChecked();

        // Set them back to checked
        bookmarks.click();
        expect(page.getByText('Notifications settings updated successfully')).toBeVisible();
    });

    test('Receive notifications for bookmarked publications', async ({ browser }) => {
        // User 2 bookmarks that publication
        const user2Page = await Helpers.users.getPageAsUser(browser, Helpers.users.user2);
        await user2Page.goto(user1PublicationPathName);
        await bookmarkPublication(user2Page);

        // User 3 red-flags that publication
        const user3Page = await Helpers.users.getPageAsUser(browser, Helpers.users.user3);
        await user3Page.goto(user1PublicationPathName);
        await redFlagPublication(user3Page);

        // User 1 now re-versions that publication
        await reVersionPublication(user1Page);

        await sendBulletin();

        // User 2 should have a notification about the new version and the red flag
        await checkEmail(
            browser,
            Helpers.users.user2.email,
            BULLETIN_SUBJECT,
            `The publication you have bookmarked, ${user1PublicationTitle} has had a new version published. Click here to view the new version`
        );

        await checkEmail(
            browser,
            Helpers.users.user2.email,
            BULLETIN_SUBJECT,
            `The publication you have bookmarked, ${user1PublicationTitle} has had a red flag raised. Click here to view the red flag`
        );
    });

    test('Receive notifications about publications I have red flagged', async ({ browser }) => {
        // User 2 red-flags that publication
        const user2Page = await Helpers.users.getPageAsUser(browser, Helpers.users.user2);
        await user2Page.goto(user1PublicationPathName);
        await redFlagPublication(user2Page);

        // User 1 now re-versions that publication
        await reVersionPublication(user1Page);

        await sendBulletin();

        // User 3 should have a notification about the new version
        await checkEmail(
            browser,
            Helpers.users.user2.email,
            BULLETIN_SUBJECT,
            `The publication you raised a red flag on, ${user1PublicationTitle} has had a new version published. Click here to view the new version`
        );
    });

    test('Receive notifications about publications I have peer reviewed', async ({ browser }) => {
        // User 2 creates a peer-review for that publication
        const user2Page = await Helpers.users.getPageAsUser(browser, Helpers.users.user2);
        await user2Page.goto(user1PublicationPathName);
        const user2PeerReviewURL = await user2Page.locator(PageModel.livePublication.writeReview).getAttribute('href');
        await user2Page.goto(user2PeerReviewURL);
        writeLinkedPublication(user2Page, `Peer Review for ${user1PublicationTitle}`);

        // User 1 now re-versions that publication
        await reVersionPublication(user1Page);

        await sendBulletin();

        // User 2 should have a notification about the new version
        await checkEmail(
            browser,
            Helpers.users.user2.email,
            BULLETIN_SUBJECT,
            `The publication you peer reviewed, ${user1PublicationTitle} has had a new version published. Click here to view the new version`
        );
    });

    test('View Notification Settings - Linked publications', async ({ browser }) => {
        // User 2 creates a peer-review for that publication
        const user2Page = await Helpers.users.getPageAsUser(browser, Helpers.users.user2);
        await user2Page.goto(user1PublicationPathName);
        const user2ProblemURL = await user2Page.locator(PageModel.topic.createProblemLink).getAttribute('href');
        await user2Page.goto(user2ProblemURL);
        writeLinkedPublication(user2Page, `Research Problem for ${user1PublicationTitle}`);

        // User 1 now re-versions that publication
        await reVersionPublication(user1Page);

        await sendBulletin();

        // User 2 should have a notification about the new version
        await checkEmail(
            browser,
            Helpers.users.user2.email,
            BULLETIN_SUBJECT,
            `The publication you are an author on, Research Problem for ${user1PublicationTitle} has had a parent publication re-versioned. Click here to view the new version of the parent publication`
        );
    });
});
