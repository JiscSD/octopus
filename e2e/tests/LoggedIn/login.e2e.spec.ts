import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('Login', () => {
    test('Can sign in and out using ORCID', async ({ browser }) => {
        const page = await browser.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser, Helpers.user3);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${Helpers.user3.fullName}`);

        await Helpers.logout(page);

        await expect(page.locator(PageModel.header.loginButton)).toBeVisible();
    });
});
