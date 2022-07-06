import { Page } from '@playwright/test';

const ORCID_TEST_USER = process.env.ORCID_TEST_USER || '';
const ORCID_TEST_PASS = process.env.ORCID_TEST_PASS || '';
const ORCID_TEST_NAME = process.env.ORCID_TEST_NAME || '';

export const login = async (page: Page) => {
    await page.locator('[aria-label="Sign in with ORCID"]').click();
    await page.fill('#username', ORCID_TEST_USER);
    await page.fill('#password', ORCID_TEST_PASS);
    await page.locator('#signin-button').click();
};

export const logout = async (page: Page) => {
    await page.locator(`text=${ORCID_TEST_NAME}`).click();
    await page.locator(`text=Log out`).click();
};
