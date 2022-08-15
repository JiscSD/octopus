import { expect, test, Page } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('Search logged out', () => {
    test('Full publication title search', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();
        await page.goto(Helpers.UI_BASE);

        // search and check result
        await Helpers.search(page, 'How has life on earth evolved?', PageModel.search.publicationSearchResult);

        // Click on search result
        await page.locator(PageModel.search.publicationSearchResult).click();
        await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');
    });

    test('Partial publication title search', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();
        await page.goto(Helpers.UI_BASE);

        // search and check result
        await Helpers.search(page, 'life evolved', PageModel.search.publicationSearchResult);

        // Click on search result
        await page.locator(PageModel.search.publicationSearchResult).click();
        await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');
    });

    test('No results search checking error', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();
        await page.goto(Helpers.UI_BASE);

        // search and check error
        await Helpers.search(page, 'thisShouldProduceNoResults', PageModel.search.noPublicationsFound);
    });

    test('Search filters', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();
        await page.goto(Helpers.UI_BASE);

        // Navigate to search page
        await page.locator(PageModel.header.searchButton).click();

        // Test filters TODO
    });
});
