import { expect, test } from "@playwright/test";
import * as Helpers from "../helpers";
import { PageModel } from "../PageModel";

test.describe("Search", () => {
  test("Full publication title search", async ({ browser }) => {
    // Start up test
    const page = await browser.newPage();

    // Login
    await page.goto(Helpers.UI_BASE);
    await Helpers.login(page, browser);
    await expect(page.locator(PageModel.header.usernameButton)).toHaveText(
      `${Helpers.ORCID_TEST_NAME}`
    );

    // search and check result
    await Helpers.search(
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
        await page.goto(Helpers.UI_BASE);

        // search and expect URL query string to contain search text
        await Helpers.search(page, 'evolved');
        await expect(page).toHaveURL(/.*query=evolved*/)

        // get path of first publication, navigate to first publication, expect URL to contain path
        const firstPublication = page.locator(PageModel.search.firstPublication);
        const firstPublicationPath = await firstPublication.getAttribute('href');
        await firstPublication.click();
        await expect(page).toHaveURL(`${Helpers.UI_BASE}${firstPublicationPath}`);

        // click browser back btn, expect URL query string to still contain search text
        await page.goBack();
        await expect(page).toHaveURL(/.*query=evolved*/)
    })
});
