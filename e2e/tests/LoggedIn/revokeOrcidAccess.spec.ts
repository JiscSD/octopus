import { expect, test } from '@playwright/test';
import { PageModel } from '../PageModel';
import * as Helpers from '../helpers';

test.describe.configure({ mode: 'serial' });

test.describe('Revoke ORCID access', () => {
    test('Can revoke access from ORCID', async ({ browser }) => {
        const page = await browser.newPage();
        await page.goto(Helpers.UI_BASE);

        // login into Octopus - this process will log the user into ORCID as well
        await Helpers.login(page, browser, Helpers.user4);

        // navigate to ORCID and revoke access for Octopus
        await page.goto('https://sandbox.orcid.org/signin');

        await Promise.all([
            page.waitForNavigation(), // user is already logged in
            page.click('button:has-text("Continue")')
        ]);

        await page.waitForLoadState('networkidle');

        // Go to 'Trusted parties'
        await page.click('button.user-menu-button');
        await page.waitForTimeout(300); // wait for dropdown animation

        await Promise.all([
            page.waitForNavigation({
                url: (url) => url.href.includes('/trusted-parties')
            }),
            page.locator('button:has-text("Trusted parties")').click()
        ]);

        // revoke Octopus access from 'Trusted organizations'
        await page.waitForSelector('.row.inline-initial-side');
        const trustedOrganizationsRow = page.locator('.row.inline-initial-side');
        await expect(trustedOrganizationsRow).toBeVisible();
        await expect(trustedOrganizationsRow.locator('.title-container > h3:has-text("Octopus")')).toBeVisible();

        await expect(trustedOrganizationsRow.locator('strong:has-text("Access granted")')).toBeVisible();

        await page.click('a:has-text("Revoke access")');
        await page.click('button:has-text("Revoke access permission")');
        await page.waitForResponse(
            (response) => response.url().includes('/account/revoke-application') && response.ok()
        );

        await expect(trustedOrganizationsRow).not.toBeVisible();

        // navigate back to Octopus
        await page.goto(Helpers.UI_BASE);

        // user should be logged out and the login button should be visible
        await page.waitForLoadState('networkidle');
        await expect(page.locator(PageModel.header.loginButton)).toBeVisible({ timeout: 60000 });

        await page.close();
    });

    test('Can revoke ORCID access from Octopus', async ({ browser }) => {
        const page = await browser.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser, Helpers.user4);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${Helpers.user4.fullName}`);

        await page.click(PageModel.header.usernameButton);

        await Promise.all([page.waitForNavigation(), page.click(PageModel.header.myPublicationsButton)]);

        await page.waitForLoadState('domcontentloaded');
        await page.click('button[title="Revoke ORCID Access"]');
        await page.waitForSelector('button[title="Yes"]');

        await Promise.all([
            page.waitForNavigation(), // wait to be redirected home after revoking ORCID access
            page.click('button[title="Yes"]')
        ]);

        await page.waitForSelector(PageModel.header.loginButton);

        await Promise.all([page.waitForNavigation(), page.click(PageModel.header.loginButton)]);

        await page.waitForLoadState('domcontentloaded');
        await page.fill(PageModel.login.username, Helpers.user4.email);
        await page.fill(PageModel.login.password, Helpers.user4.password);

        await Promise.all([
            page.waitForNavigation(), // wait to see if authorization is required
            page.click(PageModel.login.signInButton)
        ]);

        // verify authorization is required
        await expect(page.url().includes('/oauth/authorize')).toBe(true);
        await expect(page.locator(PageModel.login.authorizeButton)).toBeVisible();

        await page.close();
    });
});
