import { expect, test } from "@playwright/test";
import { PageModel } from "../PageModel";
import * as Helpers from "../helpers";

test.describe("Static pages, logged out", () => {
  test("Check homepage", async ({ browser }) => {
    // Start up test
    const page = await browser.newPage();
    await page.goto(Helpers.UI_BASE);

    // Expect elements to be visible
    await expect(page.locator("h1")).toHaveText(
      "Free, fast and fair: the global primary research record where researchers record their work in full detail"
    );
    await expect(page.locator(PageModel.header.loginButton)).toBeVisible();

    // Expect cards to be visible
    for await (const card of PageModel.homepage.cards) {
      await expect(page.locator(card)).toBeVisible();
    }

    // Expect links to be correct
    for await (const link of PageModel.footer.links) {
      await expect(page.locator(link)).toBeVisible();
    }

    // Check quick search command palette
    await page.locator(PageModel.homepage.quickSearch).click();
    await page.locator(PageModel.homepage.quickSearchInput).click();
    await page.keyboard.type("How has life on earth evolved?");
    await expect(
      page.locator(PageModel.homepage.publicationSearchResult)
    ).toBeVisible({ timeout: 20000 });
    await page.keyboard.press("Enter");

    await expect(page.locator("h1")).toHaveText(
      "Search results for How has life on earth evolved?"
    );
    await page.goBack();

    // Check dark/light toggle - TODO, sort out localStorage
    await expect(page.locator("h1")).toHaveCSS("color", "rgb(255, 255, 255)");

    await page.locator(PageModel.homepage.darkModeToggle).click();
    await expect(page.locator("h1")).toHaveCSS("color", "rgb(52, 61, 76)");
  });

  test("Check about page", async ({ browser }) => {
    // Start up test
    const page = await browser.newPage();
    await page.goto(Helpers.UI_BASE);
    await page.locator(PageModel.footer.links[2]).click();

    // Expects h1 and links (faq, author guide, aims)
    await expect(page.locator("h1")).toHaveText("Learn about Octopus.");

    await page.locator(PageModel.about.faq).click();
    await expect(page.locator("h1")).toHaveText("Frequently asked questions", {
      timeout: 10000,
    });
    await page.goBack();

    await page.locator(PageModel.about.authorGuide).click();
    await expect(page.locator("h1")).toHaveText(
      "Author guide to publishing on Octopus.",
      { timeout: 10000 }
    );
    await page.goBack();

    await page.locator(PageModel.about.aims).click();
    await expect(page.locator("h1")).toHaveText(
      "Octopus in detail: aims and priorities",
      { timeout: 10000 }
    );
    await page.goBack();

    // Expect information cards to be visible
    for await (const card of PageModel.about.infoCards) {
      await expect(page.locator(card)).toBeVisible();
    }

    // Expect video
    await expect(page.locator(PageModel.about.video)).toBeVisible();

    // Expect pub types
    for await (const pubType of PageModel.about.pubTypes) {
      await expect(page.locator(pubType)).toBeVisible();
    }

    // Expect cards to be visible
    for await (const card of PageModel.about.cards) {
      await expect(page.locator(card)).toBeVisible();
    }
  });

  test("Check static pages in the footer", async ({ browser }) => {
    // Start up test
    const page = await browser.newPage();
    await page.goto(Helpers.UI_BASE);

    // Check terms
    await page.locator(PageModel.footer.links[5]).click();
    await expect(page).toHaveURL(`${Helpers.UI_BASE}/user-terms`);
    await page.goBack();

    // Check privacy
    await page.locator(PageModel.footer.links[6]).click();
    await expect(page).toHaveURL(`${Helpers.UI_BASE}/privacy`);
    await page.goBack();

    // Check accessibility
    await page.locator(PageModel.footer.links[7]).click();
    await expect(page).toHaveURL(`${Helpers.UI_BASE}/accessibility`);
    await page.goBack();
  });
});
