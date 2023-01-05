import { expect, test } from "@playwright/test";
import * as Helpers from "../helpers";
import { PageModel } from "../PageModel";

test.describe("Login", () => {
  test("Can sign in and out using ORCID", async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(Helpers.UI_BASE);
    await Helpers.login(page, browser);
    await expect(page.locator(PageModel.header.usernameButton)).toHaveText(
      `${Helpers.ORCID_TEST_NAME}`
    );

    await Helpers.logout(page);

    await expect(page.locator(PageModel.header.loginButton)).toBeVisible();
  });
});
