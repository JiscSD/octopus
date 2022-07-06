import { expect, test } from '@playwright/test';
import { login, logout } from './helpers';

const UI_BASE = process.env.UI_BASE || 'https://localhost:3001';
const ORCID_TEST_NAME = process.env.ORCID_TEST_NAME || '';

test('Can sign in using ORCID', async ({ browser, context }) => {
    const page = await browser.newPage({ ignoreHTTPSErrors: true });
    page.goto(UI_BASE);

    await login(page);

    await expect(page.locator(`text=${ORCID_TEST_NAME}`)).toBeVisible;
});

test('Can sign out using ORCID', async ({ browser, context }) => {
    const page = await browser.newPage({ ignoreHTTPSErrors: true });
    page.goto(UI_BASE);

    await login(page);

    await expect(page.locator(`text=${ORCID_TEST_NAME}`)).toBeVisible;

    await logout(page);

    await expect(page.locator('[aria-label="Sign in with ORCID"]')).toBeVisible;
});
