import { expect, test } from '@playwright/test';
import * as Helpers from './helpers';

const UI_BASE = process.env.UI_BASE || 'https://localhost:3001';

test('Logged out: Prompted to sign in for actions', async ({ browser, context }) => {
    const page = await browser.newPage({ ignoreHTTPSErrors: true });
    await Helpers.selectFirstPublication(page);
    await expect(page.locator(`text=Sign in for more actions`)).toBeVisible;
});

test('Logged in unverified: Prompted to verify email for actions', async ({ browser, context }) => {
    const page = await browser.newPage({ ignoreHTTPSErrors: true });
    await Helpers.selectFirstPublication(page);
    await Helpers.login(page);
    await expect(page.locator(`text=Verify your email for more actions`)).toBeVisible;
});
