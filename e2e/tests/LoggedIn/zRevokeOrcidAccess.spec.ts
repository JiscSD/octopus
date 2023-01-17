import { expect, test } from "@playwright/test";
import { PageModel } from "../PageModel";
import * as Helpers from "../helpers";

test.describe.configure({ mode: "serial" });

test.describe("Revoke ORCID access", () => {
  test("Can revoke access from ORCID", async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(Helpers.UI_BASE);

    // login to Octopus
    await Helpers.login(page, browser);

    // navigate to ORCID and revoke access for Octopus
    await page.goto("https://sandbox.orcid.org/signin");

    await Promise.all([
      page.waitForNavigation(), // user is already logged into ORCID as well
      page.click('button:has-text("Continue")'),
    ]);

    await page.waitForLoadState("networkidle");

    // Go to 'Trusted parties'
    await page.click("button.user-menu-button");
    await page.waitForTimeout(300); // wait for dropdown animation

    await Promise.all([
      page.waitForNavigation({
        url: (url) => url.href.includes("/trusted-parties"),
      }),
      page.locator('button:has-text("Trusted parties")').click(),
    ]);

    // revoke Octopus access from 'Trusted organizations'
    const trustedOrganizationsRow = page.locator(".row.inline-initial-side");
    await expect(trustedOrganizationsRow).toBeVisible();
    await expect(
      trustedOrganizationsRow.locator(
        '.title-container > h3:has-text("Octopus")'
      )
    ).toBeVisible();

    await expect(
      trustedOrganizationsRow.locator('strong:has-text("Access granted")')
    ).toBeVisible();

    await page.click('a:has-text("Revoke access")');

    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/account/revoke-application") &&
          response.ok()
      ),
      page.click('button:has-text("Revoke access permission")'),
    ]);

    await expect(trustedOrganizationsRow).not.toBeVisible();

    // navigate back to Octopus
    await page.goto(Helpers.UI_BASE);

    // user should be logged out and the login button should be visible
    await page.waitForSelector(PageModel.header.loginButton, {
      timeout: 10000,
    });
    await expect(page.locator(PageModel.header.loginButton)).toBeVisible();

    await page.close();
  });

  test("Can revoke ORCID access from Octopus", async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto(Helpers.UI_BASE);
    await Helpers.login(page, browser);
    await expect(page.locator(PageModel.header.usernameButton)).toHaveText(
      `${Helpers.user1.fullName}`
    );

    await page.click(PageModel.header.usernameButton);

    await Promise.all([
      page.waitForNavigation(),
      page.click(PageModel.header.myPublicationsButton),
      page.waitForLoadState("domcontentloaded"),
    ]);

    await page.click('button[title="Revoke ORCID Access"]');
    await page.waitForSelector('button[title="Yes"]');

    await Promise.all([
      page.waitForNavigation(), // wait to be redirected home after revoking ORCID access
      page.click('button[title="Yes"]'),
    ]);

    await page.waitForSelector(PageModel.header.loginButton);

    await Promise.all([
      page.waitForNavigation(),
      page.click(PageModel.header.loginButton),
    ]);

    await page.waitForLoadState("domcontentloaded");
    await page.fill(PageModel.login.username, Helpers.user1.email);
    await page.fill(PageModel.login.password, Helpers.user1.password);

    await Promise.all([
      page.waitForNavigation(), // wait to see if authorization is required
      page.click(PageModel.login.signInButton),
    ]);

    await page.waitForURL((url) => url.href.includes("/oauth/authorize"));
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator(PageModel.login.authorizeButton)).toBeVisible();

    await page.close();
  });
});
