import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('Checking inaccessible pages', () => {
    test('Logged out: Cannot access publish, account and bookmarks pages', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Check publish create page
        await page.goto(`/create`, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState();
        await expect(page.locator(PageModel.login.signInButton)).toBeVisible();

        // Check account page
        await page.goBack();
        await page.goto(`/account`, { waitUntil: 'domcontentloaded' });

        await page.waitForLoadState();
        await expect(page.locator(PageModel.login.signInButton)).toBeVisible();

        // Check my bookmarks page
        await page.goBack();
        await page.goto(`/my-bookmarks`, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState();
        await expect(page.locator(PageModel.login.signInButton)).toBeVisible();
    });
});
