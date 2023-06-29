import { expect, test, Page } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe.configure({ mode: 'serial' });

export const testBookmarking = async (page: Page, id: string) => {
    await page.goto(`${Helpers.UI_BASE}/publications/${id}`, {
        waitUntil: 'domcontentloaded'
    });

    // Bookmark publication
    await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');

    const isRemoveBookmarkVisible = await page.isVisible(PageModel.livePublication.removeBookmark);
    if (isRemoveBookmarkVisible) {
        await page.locator(PageModel.livePublication.removeBookmark).click();
    }
    await expect(page.locator(PageModel.livePublication.addBookmark)).toBeVisible();
    await page.locator(PageModel.livePublication.addBookmark).click();

    // Check in 'my bookmarks' page
    await page.locator(PageModel.header.usernameButton).click();
    await page.locator(PageModel.header.myBookmarksButton).click();

    await page.waitForSelector(PageModel.myBookmarks.bookmark);
    await expect(page.locator(PageModel.myBookmarks.bookmark)).toHaveAttribute('href', `/publications/${id}`);

    // Remove bookmark
    await page.locator(PageModel.myBookmarks.bookmark).click();
    await page.waitForSelector('h1');
    await expect(page.locator(PageModel.livePublication.removeBookmark)).toBeVisible();
    await page.locator(PageModel.livePublication.removeBookmark).click();
};

export const testFlagging = async (page: Page, id: string, redFlagContent: string) => {
    await page.goto(`${Helpers.UI_BASE}/publications/${id}`, {
        waitUntil: 'domcontentloaded'
    });

    // Flag publication
    const isRedFlagVisible = await page.isVisible(PageModel.livePublication.redFlagLink);
    if (isRedFlagVisible) {
        await page.locator(PageModel.livePublication.redFlagLink).click();
        await page.locator(PageModel.livePublication.redFlagPreview).click();
        await page.locator(PageModel.livePublication.resolveFlag).click();
        await page.locator(PageModel.livePublication.confirmResolve).locator('visible=true').click();
        await expect(page.locator(PageModel.livePublication.redFlagPreview)).not.toBeVisible();
    }
    await expect(page.locator(PageModel.livePublication.flagConcern).locator('visible=true')).toBeVisible();
    await page.locator(PageModel.livePublication.flagConcern).locator('visible=true').click();
    await page.locator(PageModel.livePublication.redFlagComment).click();
    await page.keyboard.type(redFlagContent);
    await page.locator(PageModel.livePublication.redFlagSubmit).click();

    // Check flag and resolve flag
    await expect(page.locator(PageModel.livePublication.redFlagAlert)).toBeVisible();
    await page.locator(PageModel.livePublication.redFlagLink).click();
    await page.locator(PageModel.livePublication.redFlagPreview).click();
    await expect(page.locator('h1')).toBeVisible();
    await page.locator(PageModel.livePublication.resolveFlag).click();
    await page.locator(PageModel.livePublication.confirmResolve).locator('visible=true').click();
    await expect(page.locator(PageModel.livePublication.redFlagPreview)).not.toBeVisible();
};

test.describe('Live Publication', () => {
    test('Live Publication page contents', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${Helpers.user1.fullName}`);

        await Helpers.checkLivePublicationLayout(page, 'cl3fz14dr0001es6i5ji51rq4', true);
    });

    test('Bookmarking a publication', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${Helpers.user1.fullName}`);

        testBookmarking(page, 'cl3fz14dr0001es6i5ji51rq4');
    });

    test('Flagging a publication', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${Helpers.user1.fullName}`);

        testFlagging(page, 'cl3fz14dr0001es6i5ji51rq4', 'testing the flagging functionality');
    });

    test('Author profile', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${Helpers.user1.fullName}`);
        await page.goto(`${Helpers.UI_BASE}/publications/cl3fz14dr0001es6i5ji51rq4`, { waitUntil: 'domcontentloaded' });

        // Check and click author link
        await page.locator(PageModel.livePublication.authorLink).click();

        // Check name
        await expect(page.locator(PageModel.authorInfo.name)).toBeVisible();

        // Check ORCID data sections
        for await (const orcidDataSection of PageModel.authorInfo.orcidData) {
            await expect(page.locator(orcidDataSection)).toBeVisible();
        }

        // Check Author publications section
        await page.locator(PageModel.authorInfo.showAll).click();
        await page.waitForSelector(PageModel.authorInfo.result);
        await expect(page.locator(PageModel.authorInfo.result)).toBeVisible();
    });

    test.skip('Download pdf/json', async ({ browser }) => {
        // test TODO
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${Helpers.user1.fullName}`);
        await page.goto(`${Helpers.UI_BASE}/publications/cl3fz14dr0001es6i5ji51rq4`, { waitUntil: 'domcontentloaded' });
    });
    test.skip('Write a review for this pub', async ({ browser }) => {});
});
