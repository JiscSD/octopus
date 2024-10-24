import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('Login', () => {
    test('Can sign in and out using ORCID', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser, Helpers.users.user3);
        await page.goto('/');
        await Helpers.users.logout(page);

        await expect(page.locator(PageModel.header.loginButton)).toBeVisible();
        // Log back in to go back to pre-test state.
        await Helpers.users.login(page, browser, Helpers.users.user3);
    });
});
