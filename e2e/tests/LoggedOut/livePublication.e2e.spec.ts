import { expect, test } from "@playwright/test";
import * as Helpers from "../helpers";
import { PageModel } from "../PageModel";

test.describe("Live Publication", () => {
  test("Live publication contents", async ({ browser }) => {
    // Start up test
    const page = await browser.newPage();
    await page.goto(Helpers.UI_BASE);

    // Navigate to search page
    await page.locator(PageModel.header.searchButton).click();
    await page.locator(PageModel.search.searchInput).click();

    // Type in search term
    await page.keyboard.type("How has life on earth evolved?");
    await page.keyboard.press("Enter");
    await expect(page.locator("h1")).toHaveText(
      "Search results for How has life on earth evolved?"
    );
    await expect(
      page.locator(PageModel.search.publicationSearchResult)
    ).toBeVisible();

    // Click on search result
    await page.locator(PageModel.search.publicationSearchResult).click();
    await expect(page.locator("h1")).toHaveText(
      "How has life on earth evolved?"
    );

    // Check sections
    await Helpers.checkLivePublicationLayout(page, "cl3fz14dr0001es6i5ji51rq4");

    // Check sign in for more button and that bookmark, flag link, review link are not visible
    await expect(
      page
        .locator(PageModel.livePublication.signInForMoreButton)
        .locator("visible=true")
    ).toBeVisible();
    await expect(
      page.locator(PageModel.livePublication.addBookmark)
    ).not.toBeVisible();
    await expect(
      page.locator(PageModel.livePublication.flagConcern)
    ).not.toBeVisible();
    await expect(
      page.locator(PageModel.livePublication.writeReview)
    ).not.toBeVisible();

    // Check author link
    await expect(
      page.locator(PageModel.livePublication.authorLink)
    ).toBeVisible();
  });

  test.skip("Unverified email: live publication page", async ({ browser }) => {
    // TODO unskip when we have an account that hasn't verified their email address

    // Start up test
    const page = await browser.newPage();

    // Navigate to search page
    await page.goto(Helpers.UI_BASE);
    await Helpers.login(page, browser);
    await expect(page.locator(PageModel.header.usernameButton)).toHaveText(
      `${Helpers.user1.fullName}`
    );

    await page.locator(PageModel.header.searchButton).click();
    await page.locator(PageModel.search.searchInput).click();

    // Type in search term
    await page.keyboard.type("How has life on earth evolved?");
    await page.keyboard.press("Enter");
    await expect(page.locator("h1")).toHaveText(
      "Search results for How has life on earth evolved?"
    );
    await expect(
      page.locator(PageModel.search.publicationSearchResult)
    ).toBeVisible();

    // Click on search result
    await page.locator(PageModel.search.publicationSearchResult).click();
    await expect(page.locator("h1")).toHaveText(
      "How has life on earth evolved?"
    );
    await expect(
      page
        .locator(PageModel.livePublication.verifyEmailForMoreButton)
        .locator("visible=true")
    ).toBeVisible();
    // await expect(page.locator(PageModel.livePublication.addBookmark)).not.toBeVisible(); TODO uncomment this when this is fixed!
    await expect(
      page.locator(PageModel.livePublication.flagConcern)
    ).not.toBeVisible();
    await expect(
      page.locator(PageModel.livePublication.writeReview)
    ).not.toBeVisible();
  });
});
