import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('Checking inaccessible pages', () => {
    test('Logged out: Cannot access publish, account and bookmarks pages', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Check publish create page
        await page.goto(`${Helpers.UI_BASE}/create`, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState();
        await expect(page.locator(PageModel.login.signInButton)).toBeVisible();

        // Check account page
        await page.goBack();
        await page.goto(`${Helpers.UI_BASE}/account`, { waitUntil: 'domcontentloaded' });

        await page.waitForLoadState();
        await expect(page.locator(PageModel.login.signInButton)).toBeVisible();

        // Check my bookmarks page
        await page.goBack();
        await page.goto(`${Helpers.UI_BASE}/my-bookmarks`, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState();
        await expect(page.locator(PageModel.login.signInButton)).toBeVisible();
    });

    test.skip('Unverified email: live publication page', async ({ browser }) => {
        // TODO unskip when we have an account that hasn't verified their email address

        // Start up test
        const page = await browser.newPage();

        // Navigate to search page
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${process.env.ORCID_TEST_NAME}`);

        await page.locator(PageModel.header.searchButton).click();
        await page.locator(PageModel.search.searchInput).click();

        // Type in search term
        await page.keyboard.type('How has life on earth evolved?');
        await page.keyboard.press('Enter');
        await expect(page.locator('h1')).toHaveText('Search results for How has life on earth evolved?');
        await expect(page.locator(PageModel.search.publicationSearchResult)).toBeVisible();

        // Click on search result
        await page.locator(PageModel.search.publicationSearchResult).click();
        await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');
        await page.pause();
        await expect(
            page.locator(PageModel.livePublication.verifyEmailForMoreButton).locator('visible=true')
        ).toBeVisible();
        // await expect(page.locator(PageModel.livePublication.addBookmark)).not.toBeVisible(); TODO uncomment this when this is fixed!
        await expect(page.locator(PageModel.livePublication.flagConcern)).not.toBeVisible();
        await expect(page.locator(PageModel.livePublication.writeReview)).not.toBeVisible();
    });
});
