import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('Different search scenarios to test out publication search when logged in', () => {
    test('Search for a full publication title, partial publication title and no results when logged in', async ({
        browser
    }) => {
        // Start up test
        const page = await browser.newPage({ ignoreHTTPSErrors: true });
        await page.goto(Helpers.UI_BASE);

        // Login
        await Helpers.login(page);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${process.env.ORCID_TEST_NAME}`);

        // Navigate to search page
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

        await page.goto(Helpers.UI_BASE);

        // Navigate to search page
        await page.locator(PageModel.header.searchButton).click();
        await page.locator(PageModel.search.searchInput).click();

        // Type in search term
        await page.keyboard.type('life evolved');
        await page.keyboard.press('Enter');
        await expect(page.locator('h1')).toHaveText('Search results for life evolved');
        await expect(page.locator(PageModel.search.publicationSearchResult)).toBeVisible();

        // Click on search result
        await page.locator(PageModel.search.publicationSearchResult).click();
        await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');

        await page.goto(Helpers.UI_BASE);

        // Navigate to search page
        await page.locator(PageModel.header.searchButton).click();
        await page.locator(PageModel.search.searchInput).click();

        // Type in search term
        await page.keyboard.type('thisShouldProduceNoResults');
        await page.keyboard.press('Enter');
        await expect(page.locator('h1')).toHaveText('Search results for thisShouldProduceNoResults');

        // Check for alert
        await expect(page.locator(PageModel.search.noPublicationsFound)).toBeVisible();

        // Finish test
        await browser.close();
    });
});
