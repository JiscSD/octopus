import { expect, Page } from '@playwright/test';
import { PageModel } from '../PageModel';

export const search = async (page: Page, searchTerm: string, publicationSearchResult?: string) => {
    // Navigate to search page
    await page.locator(PageModel.header.searchButton).click();
    await page.locator(PageModel.search.searchInput).click();

    // Type in search term
    await page.keyboard.type(searchTerm);
    await page.keyboard.press('Enter');
    await page.waitForResponse((response) => response.url().includes('/publication-versions'));
    await expect(page.locator('h1')).toHaveText(`Search results for ${searchTerm}`);

    // if (publicationSearchResult passed in) expect its href anchor to be visible
    publicationSearchResult && (await expect(page.locator(publicationSearchResult)).toBeVisible());
};
