import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';

const UI_BASE = process.env.UI_BASE || 'https://localhost:3001';

test('Logged out: Can sign in using ORCID', async ({ browser, context }) => {
    const page = await browser.newPage({ ignoreHTTPSErrors: true });
    page.goto(UI_BASE);

    await Helpers.login(page);

    await expect(page.locator(`text=${process.env.ORCID_TEST_NAME}`)).toBeVisible;
});

test('Logged in: Can sign out using ORCID', async ({ browser, context }) => {
    const page = await browser.newPage({ ignoreHTTPSErrors: true });
    page.goto(UI_BASE);

    await Helpers.login(page);

    await expect(page.locator(`text=${process.env.ORCID_TEST_NAME}`)).toBeVisible;

    await Helpers.logout(page);

    await expect(page.locator('[aria-label="Sign in with ORCID"]')).toBeVisible;
});

test('Logged out: Cannot access Publish', async ({ browser, context }) => {
    const page = await browser.newPage({ ignoreHTTPSErrors: true });
    page.goto(`${UI_BASE}/create`);
    await page.waitForNavigation();
    await expect(page.url()).toContain('https://orcid.org/');
});
