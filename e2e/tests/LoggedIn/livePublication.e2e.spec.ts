import { expect, test, Page } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe.configure({ mode: 'serial' });

export const testBookmarking = async (page: Page, id: string) => {
    await page.goto(`/publications/${id}`, {
        waitUntil: 'domcontentloaded'
    });

    // Bookmark publication
    await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');

    const isRemoveBookmarkVisible = await page.isVisible(PageModel.livePublication.removeBookmark);
    if (isRemoveBookmarkVisible) {
        await Promise.all([
            page.locator(PageModel.livePublication.removeBookmark).click(),
            page.waitForResponse(
                (response) =>
                    response.request().method() === 'DELETE' && response.url().includes('/bookmarks') && response.ok()
            )
        ]);
    }
    await expect(page.locator(PageModel.livePublication.addBookmark)).toBeVisible();
    await Promise.all([
        page.locator(PageModel.livePublication.addBookmark).click(),
        page.waitForResponse(
            (response) =>
                response.request().method() === 'POST' && response.url().includes('/bookmarks') && response.ok()
        )
    ]);

    // Check in 'my bookmarks' page
    await page.locator(PageModel.header.usernameButton).click();
    await page.locator(PageModel.header.notificationsButton).click();

    await page.waitForSelector(PageModel.myBookmarks.bookmarkedPublicationLink);
    await expect(page.locator(PageModel.myBookmarks.bookmarkedPublicationLink)).toHaveAttribute(
        'href',
        `/publications/${id}`
    );

    // Remove bookmark
    await Promise.all([
        page.waitForURL('**/publications/' + id + '/versions/latest'),
        page.locator(PageModel.myBookmarks.bookmarkedPublicationLink).click()
    ]);
    await page.waitForSelector('h1');
    await expect(page.locator(PageModel.livePublication.removeBookmark)).toBeVisible();
    await page.locator(PageModel.livePublication.removeBookmark).click();
};

export const testFlagging = async (page: Page, id: string, redFlagContent: string) => {
    await page.goto(`/publications/${id}`, {
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
    await Promise.all([
        page.locator(PageModel.livePublication.redFlagSubmit).click(),
        page.waitForResponse(
            (response) => response.request().method() === 'POST' && response.url().includes('/flags') && response.ok()
        )
    ]);

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
        const page = await Helpers.users.getPageAsUser(browser);
        await Helpers.livePublication.checkLivePublicationLayout(page, 'cl3fz14dr0001es6i5ji51rq4', true);
    });

    test('Bookmarking a publication', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await testBookmarking(page, 'cl3fz14dr0001es6i5ji51rq4');
    });

    test('Flagging a publication', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await testFlagging(page, 'cl3fz14dr0001es6i5ji51rq4', 'testing the flagging functionality');
    });

    test('Download pdf/json', async ({ browser, headless }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await page.goto(`/publications/cl3fz14dr0001es6i5ji51rq4`, { waitUntil: 'domcontentloaded' });

        // Behaviour is different depending on whether test is running headless or not.
        if (headless) {
            // Download PDF
            const downloadPromise = page.waitForEvent('download');
            await page.locator('aside').getByLabel('Download PDF').click();
            const download = await downloadPromise;
            expect(download.suggestedFilename()).toEqual('cl3fz14dr0001es6i5ji51rq4.pdf');
        } else {
            // Open PDF in new tab
            const newTabPromise = page.waitForEvent('popup');
            await page.locator('aside').getByLabel('Download PDF').click();
            const newTab = await newTabPromise;
            await newTab.waitForLoadState();
            await expect(newTab).toHaveURL(/.*\/cl3fz14dr0001es6i5ji51rq4.pdf/);
        }
    });
    test.skip('Write a review for this pub', async ({ browser }) => {});
});
