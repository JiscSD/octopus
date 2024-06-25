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
        await page.locator(PageModel.livePublication.removeBookmark).click();
    }
    await expect(page.locator(PageModel.livePublication.addBookmark)).toBeVisible();
    await page.locator(PageModel.livePublication.addBookmark).click();

    // Check in 'my bookmarks' page
    await page.locator(PageModel.header.usernameButton).click();
    await page.locator(PageModel.header.myBookmarksButton).click();

    await page.waitForSelector(PageModel.myBookmarks.publicationBookmark);
    await expect(page.locator(PageModel.myBookmarks.publicationBookmark)).toHaveAttribute(
        'href',
        `/publications/${id}`
    );

    // Remove bookmark
    await page.locator(PageModel.myBookmarks.publicationBookmark).click();
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
        const page = await Helpers.getPageAsUser(browser);
        await Helpers.checkLivePublicationLayout(page, 'cl3fz14dr0001es6i5ji51rq4', true);
    });

    test('Bookmarking a publication', async ({ browser }) => {
        const page = await Helpers.getPageAsUser(browser);
        await testBookmarking(page, 'cl3fz14dr0001es6i5ji51rq4');
    });

    test('Flagging a publication', async ({ browser }) => {
        const page = await Helpers.getPageAsUser(browser);
        await testFlagging(page, 'cl3fz14dr0001es6i5ji51rq4', 'testing the flagging functionality');
    });

    test('Author profile', async ({ browser }) => {
        const page = await Helpers.getPageAsUser(browser);
        await page.goto(`/publications/cl3fz14dr0001es6i5ji51rq4`, { waitUntil: 'domcontentloaded' });

        // Check and click author link
        await page.locator(PageModel.livePublication.authorLink).click();
        await page.waitForURL(`/authors/octopus`);

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

    test('Download pdf/json', async ({ browser, headless }) => {
        const page = await Helpers.getPageAsUser(browser);
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
