import { expect, test } from '@playwright/test';
import * as helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe("Search", () => {
  test("Full publication title search", async ({ browser }) => {
    // Start up test
    const page = await browser.newPage();

    // Login
    await page.goto(helpers.UI_BASE);
    await helpers.login(page, browser);
    await expect(page.locator(PageModel.header.usernameButton)).toHaveText(
      `${helpers.ORCID_TEST_NAME}`
    );

    // search and check result
    await helpers.search(
      page,
      "How has life on earth evolved?",
      PageModel.search.publicationSearchResult
    );

    // Click on search result
    await page.locator(PageModel.search.publicationSearchResult).click();
    await expect(page.locator("h1")).toHaveText(
      "How has life on earth evolved?"
    );
  });
});

test.describe('Search term is persisted in URL query string', () => {
    test('Partial search term search', async ({browser}) => {
        // Start up test
        const page = await browser.newPage();
        await page.goto(helpers.UI_BASE);

        // search and expect URL query string to contain search text
        await helpers.search(page, PageModel.search.searchTerm);
        await expect(page).toHaveURL(new RegExp(`query=${PageModel.search.searchTerm}`));

        // navigate to first publication (expect URL to contain path) click browser 'back'
        await helpers.clickFirstPublication(page);
        await page.goBack();

        await expect(page).toHaveURL(new RegExp(`query=${PageModel.search.searchTerm}`));
    })
});

test.describe('dateTo and dateFrom fields are persisted in URL query string', () => {
    test('dateTo and dateFrom in query string', async ({browser}) => {
        // Start up test
        const page = await browser.newPage();
        await page.goto(helpers.UI_BASE);
        await page.locator(PageModel.header.searchButton).click();

        //select dateFrom & dateTo
        const dateFromInput = page.locator(PageModel.search.dateFromInput);
        const dateToInput = page.locator(PageModel.search.dateToInput);

        await dateFromInput.fill(PageModel.search.dateFrom);
        await dateToInput.fill(PageModel.search.dateTo);

        // expect dateFrom/dateTo input and URL to match selections
        await helpers.testDateInput(page, dateFromInput, dateToInput);

        // navigate to first publication (expect URL to contain path) click browser 'back'
        await helpers.clickFirstPublication(page);
        await page.goBack();

        // expect dateFrom/dateTo input and URL to match selections
        await helpers.testDateInput(page, dateFromInput, dateToInput);
    });
});
