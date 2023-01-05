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
