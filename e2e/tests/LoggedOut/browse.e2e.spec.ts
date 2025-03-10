import { expect, test } from '@playwright/test';
import { PageModel } from '../PageModel';

test.describe('Browse', () => {
    test('Browse contents', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();
        await page.goto('/');
        // Navigate to browse page
        await page.locator(PageModel.header.browseButton).click();

        // Check links
        await expect(page.locator(PageModel.browse.viewAllPublications)).toHaveAttribute('href', '/search');
        await expect(page.locator(PageModel.browse.viewAllAuthors)).toHaveAttribute('href', '/search/authors');

        // Expect 5 cards
        await expect(page.locator(PageModel.browse.card).locator('visible=true')).toHaveCount(5);
    });
});
