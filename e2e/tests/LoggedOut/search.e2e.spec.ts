import { Page, expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('Publication search', () => {
    test('Full publication title search', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();
        await page.goto('/');

        // search and check result
        await Helpers.search.search(page, 'How has life on earth evolved?', PageModel.search.publicationSearchResult);

        // Click on search result
        await page.locator(PageModel.search.publicationSearchResult).click();
        await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');
    });

    test('Partial publication title search', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();
        await page.goto('/');

        // search and check result
        await Helpers.search.search(page, 'life evolved', PageModel.search.publicationSearchResult);

        // Click on search result
        await page.locator(PageModel.search.publicationSearchResult).click();
        await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');
    });

    test('No results search checking error', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();
        await page.goto('/');

        // search and check error
        await Helpers.search.search(page, 'thisShouldProduceNoResults', PageModel.search.noPublicationsFound);
    });

    test('Search filters', async ({ browser }) => {
        const page = await browser.newPage();
        await page.goto('/search');
        // Set filters that should reduce results down to one we know in advance.
        await page.getByRole('checkbox', { name: 'Individual' }).click();
        await page.waitForResponse(
            (response) =>
                response.url().includes('/publication-versions?limit=10&offset=0&authorType=individual') &&
                response.ok()
        );
        await page.getByRole('checkbox', { name: 'Results' }).click();
        await page.waitForResponse(
            (response) =>
                response.url().includes('/publication-versions?type=DATA&limit=10&offset=0&authorType=individual') &&
                response.ok()
        );
        await Helpers.search.search(page, 'complicated', 'a[href="/publications/publication-user-5-data-1-live"]');

        // Clear filters and check they are cleared
        await page.getByRole('button', { name: 'Clear filters' }).click();
        await page.waitForResponse(
            (response) => response.url().includes('/publication-versions?limit=10&offset=0') && response.ok()
        );
        const checkboxes = await page.locator('input[type="checkbox"]').all();
        for (const checkbox of checkboxes) {
            await expect(checkbox).not.toBeChecked();
        }
        await expect(page.locator(PageModel.search.searchInput)).toHaveValue('');
    });
});

test.describe('Topics search', () => {
    const search = async (page: Page, searchTerm: string) => {
        await page.locator('input[name="searchTerm"]').click();
        await page.locator('input[name="searchTerm"]').fill('');
        await page.keyboard.type(searchTerm, { delay: 100 });
        await page.keyboard.press('Enter');
        await page.waitForResponse((response) => response.url().includes('/topics') && response.ok());
    };

    test('Topics are paginated', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(`/search/topics`);
        await page.waitForResponse((response) => response.url().includes('/topics') && response.ok());
        await expect(page.locator('#pagination-info')).toContainText(/Showing \d+ - \d+ of \d+/);
        await expect(page.getByText('Previous')).toBeVisible();
        await expect(page.getByText('Next')).toBeVisible();

        await page.close();
    });

    test('Can search for topics using the quick search input field', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(`/search/topics`);

        await search(page, 'no-results');

        await expect(page.locator('h3:has-text("No results found")')).toBeVisible();
        await expect(page.locator('#pagination-info')).not.toBeVisible();
        await expect(page.getByText('Previous')).not.toBeVisible();
        await expect(page.getByText('Next')).not.toBeVisible();

        await search(page, 'test');
        await expect(page.locator('#pagination-info')).toContainText(/Showing \d+ - \d+ of \d+/);
        await expect(page.getByText('Previous')).toBeVisible();
        await expect(page.getByText('Next')).toBeVisible();

        await page.close();
    });

    test('Search query is preserved in the url', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const searchTerm = 'test';

        await page.goto(`/search/topics?query=${searchTerm}`);
        await page.waitForResponse((response) => response.url().includes('/topics') && response.ok());

        // quick search input value should equal 'test'
        expect(await page.locator('input[name="searchTerm"]').inputValue()).toEqual(searchTerm);

        const topics = page.locator('article a');
        const topicsCount = await topics.count();

        expect(topicsCount).toBeGreaterThan(1);

        // check that each topic contains the search term
        for (let i = 0; i < topicsCount; i++) {
            expect((await topics.nth(i).textContent()).toLowerCase()).toContain(searchTerm);
        }

        await page.close();
    });
});
