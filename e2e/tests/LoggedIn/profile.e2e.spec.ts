import * as Helpers from "../helpers";
import { BrowserContext, expect, Page, test } from "@playwright/test";
import { PageModel } from "../PageModel";

test.describe("Live author page", () => {
  let context: BrowserContext;
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    // navigate to homepage
    await page.goto(Helpers.UI_BASE, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle("Octopus | Built for Researchers");

    // login
    await Helpers.login(page, browser);
    await expect(page.locator(PageModel.header.usernameButton)).toHaveText(
      `${Helpers.user1.fullName}`
    );

    // go to "Live author page" page
    await page.locator(PageModel.header.usernameButton).click();
    await page.locator(PageModel.header.myProfileButton).click();
    await page.locator(PageModel.myPublications.liveAuthorPageButton).click();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("Live author page contents", async () => {
    // check user full name
    await expect(page.locator("h1")).toHaveText(`${Helpers.user1.fullName}`);

    // check Employment section
    expect(page.locator(PageModel.profilePage.employment)).toBeVisible();

    const employmentRow = page.locator('tr:has-text("Southern Cross QE")');
    await expect(employmentRow).toBeVisible();

    // check Education section
    expect(page.locator(PageModel.profilePage.education)).toBeVisible();

    // check Works section
    expect(page.locator(PageModel.profilePage.works)).toBeVisible();

    // check Octopus publications section
    await expect(
      page.locator(PageModel.profilePage.octopusPublications)
    ).toBeVisible();
  });

  test("ORCID profile link opens in a new tab", async () => {
    // check ORCID profile link
    const orcidProfileLink = page.locator('a[title="ORCID profile"]');
    await expect(orcidProfileLink).toBeVisible();

    await orcidProfileLink.click();
    await context.waitForEvent("page");

    const pages = context.pages();
    expect(pages.length).toEqual(2);

    const orcidProfilePage = pages[1];
    await expect(orcidProfilePage).toHaveURL(
      (await orcidProfileLink.getAttribute("href")) as string
    );
    await orcidProfilePage.close();
  });
});
