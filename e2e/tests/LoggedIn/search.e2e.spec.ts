import { expect, Locator, Page, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('Search', () => {
    test('Full publication title search', async ({ browser }) => {
        // Start up test
        const page = await Helpers.users.getPageAsUser(browser);
        await page.goto('/');

        // search and check result
        await Helpers.search.search(page, 'How has life on earth evolved?', PageModel.search.publicationSearchResult);

        // Click on search result
        await page.locator(PageModel.search.publicationSearchResult).click();
        await expect(page.locator('h1')).toContainText('How has life on earth evolved?');
    });
});

const clickFirstPublication = async (page: Page): Promise<void> => {
    const firstPublication = page.locator(PageModel.search.firstPublication);
    const firstPublicationPath = await firstPublication.getAttribute('href');
    await firstPublication.click();

    // expect URL to contain publication path
    await expect(page).toHaveURL(`${firstPublicationPath}/versions/latest`);
};

test.describe('Search term is persisted in URL query string', () => {
    test('Partial search term search', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();
        await page.goto('/');

        // search and expect URL query string to contain search text
        await Helpers.search.search(page, PageModel.search.searchTerm);
        await expect(page).toHaveURL(new RegExp(`query=${PageModel.search.searchTerm}`));

        // navigate to first publication (expect URL to contain path) click browser 'back'
        await clickFirstPublication(page);
        await page.goBack();

        await expect(page).toHaveURL(new RegExp(`query=${PageModel.search.searchTerm}`));
    });
});

const testDateInput = async (page: Page, dateFromInput: Locator, dateToInput: Locator): Promise<void> => {
    await expect(dateFromInput).toHaveValue(PageModel.search.dateFrom);
    await expect(dateToInput).toHaveValue(PageModel.search.dateTo);

    await page.waitForURL(
        `**/search/publications?dateTo=${PageModel.search.dateTo}&dateFrom=${PageModel.search.dateFrom}`
    );
};

test.describe('dateTo and dateFrom fields are persisted in URL query string', () => {
    test('dateTo and dateFrom in query string', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();
        await page.goto('/');
        await page.locator(PageModel.header.searchButton).click();

        //select dateFrom & dateTo
        const dateFromInput = page.locator(PageModel.search.dateFromInput);
        const dateToInput = page.locator(PageModel.search.dateToInput);

        await dateFromInput.fill(PageModel.search.dateFrom);
        await dateToInput.fill(PageModel.search.dateTo);
        await page.getByRole('button', { name: 'Apply date filter' }).click();

        // expect dateFrom/dateTo input and URL to match selections
        await testDateInput(page, dateFromInput, dateToInput);

        // navigate to first publication (expect URL to contain path) click browser 'back'
        await clickFirstPublication(page);
        await page.goBack();

        // expect dateFrom/dateTo input and URL to match selections
        await testDateInput(page, dateFromInput, dateToInput);
    });
});
