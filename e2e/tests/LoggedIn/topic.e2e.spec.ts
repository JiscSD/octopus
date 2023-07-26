import { expect, test, Page } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe.configure({ mode: 'serial' });

const addBookmark = async (page: Page) => {
    await page.goto(`${Helpers.UI_BASE}/topics/test-topic-1`, {
        waitUntil: 'domcontentloaded'
    });

    // Bookmark topic
    await expect(page.locator('h1')).toHaveText('Test topic');

    const isRemoveBookmarkVisible = await page.isVisible(PageModel.topic.removeBookmark);
    if (isRemoveBookmarkVisible) {
        await page.locator(PageModel.topic.removeBookmark).click();
    }
    await expect(page.locator(PageModel.topic.addBookmark)).toBeVisible();
    await page.locator(PageModel.topic.addBookmark).click();
};

test.describe('Topic page', () => {

    test('Bookmark a topic', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${Helpers.user1.fullName}`);

        // Add bookmark
        await addBookmark(page);
    
        // Confirm it is present on 'my bookmarks' page
        await page.locator(PageModel.header.usernameButton).click();
        await page.locator(PageModel.header.myBookmarksButton).click();
    
        await expect(page.locator(PageModel.myBookmarks.topicBookmark)).toBeVisible();
    });

    test('Remove a topic bookmark from topic page', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${Helpers.user1.fullName}`);

        await addBookmark(page);

        // Remove bookmark
        await expect(page.locator(PageModel.topic.removeBookmark)).toBeVisible();
        await page.locator(PageModel.topic.removeBookmark).click();

        // Confirm it is not present on 'my bookmarks' page
        await page.locator(PageModel.header.usernameButton).click();
        await page.locator(PageModel.header.myBookmarksButton).click();

        await expect(page.locator(PageModel.myBookmarks.topicBookmark)).not.toBeVisible();
    });

    test('Remove a topic bookmark from My Bookmarks page', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${Helpers.user1.fullName}`);

        await addBookmark(page);

        // Remove bookmark from 'my bookmarks' page
        await page.locator(PageModel.header.usernameButton).click();
        await page.locator(PageModel.header.myBookmarksButton).click();
        await expect(page.locator(PageModel.myBookmarks.removeTopicBookmark)).toBeVisible();
        await page.locator(PageModel.myBookmarks.removeTopicBookmark).click();
        await expect(page.locator(PageModel.myBookmarks.topicBookmark)).not.toBeVisible();
    });
});
