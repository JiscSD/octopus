import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe.configure({ mode: 'parallel' });

test.describe('Different search scenarios to test out publication search', () => {
    test('Search for a full publication title', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage({ ignoreHTTPSErrors: true });
        await page.goto(Helpers.UI_BASE);

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

        // Finish test
        await browser.close();
    });

    test('Search for a partial publication title', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage({ ignoreHTTPSErrors: true });
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

        // Finish test
        await browser.close();
    });

    test('Search for a phrase that shows no results', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage({ ignoreHTTPSErrors: true });
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
