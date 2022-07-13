import { Page } from '@playwright/test';
import * as Type from '@types';

const ORCID_TEST_USER = process.env.ORCID_TEST_USER;
const ORCID_TEST_PASS = process.env.ORCID_TEST_PASS;
const ORCID_TEST_NAME = process.env.ORCID_TEST_NAME;
const UI_BASE = process.env.UI_BASE || 'https://localhost:3001';

if (!ORCID_TEST_USER || !ORCID_TEST_PASS || !ORCID_TEST_NAME) throw 'Environment variables not set';

export const login = async (page: Page) => {
    await page.locator('[aria-label="Sign in with ORCID"]').click();
    await page.fill('#username', ORCID_TEST_USER);
    await page.fill('#password', ORCID_TEST_PASS);
    await page.locator('#signin-button').click();
};

export const logout = async (page: Page) => {
    const userMenu = await page.locator(`text=${ORCID_TEST_NAME}`);
    if (userMenu) {
        await userMenu.click();
        await page.locator(`text=Log out`).click();
    }
};

export const selectFirstPublication = async (page: Page, type: Type.PublicationType = 'PROBLEM') => {
    await page.goto(`${UI_BASE}/search?for=publications&type=${type}`);
    await page.locator(`article`).first().click();
};
