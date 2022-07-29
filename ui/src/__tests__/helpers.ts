import { chromium, expect, Page } from '@playwright/test';
import * as Type from '@types';
import { PageModel } from './PageModel';

const ORCID_TEST_USER = process.env.ORCID_TEST_USER;
const ORCID_TEST_PASS = process.env.ORCID_TEST_PASS;
const ORCID_TEST_NAME = process.env.ORCID_TEST_NAME;

export const UI_BASE = process.env.UI_BASE || 'https://localhost:3001';

if (!ORCID_TEST_USER || !ORCID_TEST_PASS || !ORCID_TEST_NAME) throw 'Environment variables not set';

export const login = async (page: Page) => {
    await page.locator(PageModel.header.loginButton).click();
    await page.fill(PageModel.login.username, ORCID_TEST_USER);
    await page.fill(PageModel.login.password, ORCID_TEST_PASS);
    await page.locator(PageModel.login.signInButton).click();
    await page.waitForNavigation();
};

export const logout = async (page: Page) => {
    const userMenu = page.locator(PageModel.header.usernameButton);
    if (userMenu) {
        await userMenu.click();
        await page.locator(PageModel.header.logoutButton).click();
    }
    await page.waitForNavigation();
    await expect(page.locator(PageModel.header.loginButton)).toBeVisible();
};

export const selectFirstPublication = async (page: Page, type: Type.PublicationType = 'PROBLEM') => {
    await page.goto(`${UI_BASE}/search?for=publications&type=${type}`);
    await page.locator(`article`).first().click();
};
