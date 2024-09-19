import { expect, test, Page } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe.configure({ mode: 'serial' });

// Recreate parameter controls the behaviour when a bookmark already exists.
// If true, it will remove and recreate it; if false, it will leave it.
const ensureBookmarkPresent = async (page: Page, recreate: boolean = false) => {
    await page.goto(`/topics/cly468yyb00177ryzsvccai51`, {
        waitUntil: 'domcontentloaded'
    });

    // Bookmark topic
    await expect(page.locator('h1')).toHaveText('Computer science');

    await page.waitForResponse((response) => response.url().includes('/topics') && response.ok());

    const isRemoveBookmarkVisible = await page.isVisible(PageModel.topic.removeBookmark);
    if (isRemoveBookmarkVisible) {
        if (recreate) {
            await page.locator(PageModel.topic.removeBookmark).click();
        } else {
            return true;
        }
    } else {
        await expect(page.locator(PageModel.topic.addBookmark)).toBeVisible();
        await page.locator(PageModel.topic.addBookmark).click();
    }
};

test.describe('Topic page', () => {
    test('Bookmark a topic', async ({ browser }) => {
        const page = await Helpers.getPageAsUser(browser);

        // Add bookmark
        await ensureBookmarkPresent(page, true);

        // Confirm it is present on 'my bookmarks' page
        await page.locator(PageModel.header.usernameButton).click();
        await page.locator(PageModel.header.myBookmarksButton).click();
        await page.waitForURL('**/my-bookmarks');

        await expect(page.locator(PageModel.myBookmarks.topicBookmark)).toBeVisible();
    });

    test('Remove a topic bookmark from topic page', async ({ browser }) => {
        const page = await Helpers.getPageAsUser(browser);

        await ensureBookmarkPresent(page);

        // Remove bookmark
        await expect(page.locator(PageModel.topic.removeBookmark)).toBeVisible();
        await page.locator(PageModel.topic.removeBookmark).click();

        // Confirm it is not present on 'my bookmarks' page
        await page.locator(PageModel.header.usernameButton).click();
        await page.locator(PageModel.header.myBookmarksButton).click();

        await expect(page.locator(PageModel.myBookmarks.topicBookmark)).not.toBeVisible();
    });

    test('Remove a topic bookmark from My Bookmarks page', async ({ browser }) => {
        const page = await Helpers.getPageAsUser(browser);

        await ensureBookmarkPresent(page);

        // Remove bookmark from 'my bookmarks' page
        await page.locator(PageModel.header.usernameButton).click();
        await page.locator(PageModel.header.myBookmarksButton).click();
        await expect(page.locator(PageModel.myBookmarks.removeTopicBookmark)).toBeVisible();
        await page.locator(PageModel.myBookmarks.removeTopicBookmark).click();
        await expect(page.locator(PageModel.myBookmarks.topicBookmark)).not.toBeVisible();
    });
});
