import { Browser, expect, Page } from '@playwright/test';
import { PageModel } from '../PageModel';
import { MAILPIT } from './constants';

export type TestUser = {
    email: string;
    password: string;
    shortName: string;
    fullName: string;
};

// test user 1
export const user1: TestUser = {
    email: process.env.ORCID_TEST_USER,
    password: process.env.ORCID_TEST_PASS,
    shortName: `${process.env.ORCID_TEST_FIRST_NAME?.[0]}. ${process.env.ORCID_TEST_LAST_NAME}`,
    fullName: `${process.env.ORCID_TEST_FIRST_NAME} ${process.env.ORCID_TEST_LAST_NAME}`
};

// test user 2
export const user2: TestUser = {
    email: process.env.ORCID_TEST_USER2,
    password: process.env.ORCID_TEST_PASS2,
    shortName: `${process.env.ORCID_TEST_FIRST_NAME2?.[0]}. ${process.env.ORCID_TEST_LAST_NAME2}`,
    fullName: `${process.env.ORCID_TEST_FIRST_NAME2} ${process.env.ORCID_TEST_LAST_NAME2}`
};

// test user 3
export const user3: TestUser = {
    email: process.env.ORCID_TEST_USER3,
    password: process.env.ORCID_TEST_PASS3,
    shortName: `${process.env.ORCID_TEST_FIRST_NAME3?.[0]}. ${process.env.ORCID_TEST_LAST_NAME3}`,
    fullName: `${process.env.ORCID_TEST_FIRST_NAME3} ${process.env.ORCID_TEST_LAST_NAME3}`
};

// test user 4
export const user4: TestUser = {
    email: process.env.ORCID_TEST_USER4,
    password: process.env.ORCID_TEST_PASS4,
    shortName: `${process.env.ORCID_TEST_FIRST_NAME4?.[0]}. ${process.env.ORCID_TEST_LAST_NAME4}`,
    fullName: `${process.env.ORCID_TEST_FIRST_NAME4} ${process.env.ORCID_TEST_LAST_NAME4}`
};

export const users = [user1, user2, user3, user4];

export const login = async (page: Page, browser: Browser, user: TestUser) => {
    await page.goto('/');
    await page.waitForSelector(PageModel.header.loginButton);
    await Promise.all([page.waitForURL(/signin\?client_id/), page.click(PageModel.header.loginButton)]);

    // If necessary, reject cookies
    const cookieCheck = await page.locator(PageModel.login.rejectCookies).isVisible();
    if (cookieCheck) {
        await page.click(PageModel.login.rejectCookies);
    }

    await page.fill(PageModel.login.username, user.email);
    await page.fill(PageModel.login.password, user.password);

    await page.click(PageModel.login.signInButton);

    // After signing in, we can either be still on orcid (if authorization is required), or back on octopus.
    await page.waitForURL(/oauth\/authorize/);
    await page.waitForLoadState('networkidle');
    const needsAuthorization =
        page.url().includes('/oauth/authorize') && (await page.locator(PageModel.login.authorizeButton).isVisible());

    if (needsAuthorization) {
        await page.click(PageModel.login.authorizeButton);
    }

    await page.waitForURL(/login\?code=/);
    await page.waitForSelector(PageModel.header.usernameButton);

    // check if email verification is required
    const needsEmailVerification = (await page.title()) === 'Complete your registration';

    if (needsEmailVerification) {
        await page.fill('#email', user.email);
        await page.click('button[title="Send code"]');
        await page.waitForSelector('#code');

        // open new tab
        const context = await browser.newContext();
        const [newPage] = await Promise.all([context.waitForEvent('page'), context.newPage()]);

        // navigate to Mailpit and take the last verification code sent to this user
        await newPage.goto(MAILPIT);
        await newPage
            .locator(`.message:has-text("${user.email}")`, { hasText: 'Verify your Octopus account' })
            .first()
            .click();
        const verificationCode = await newPage.frameLocator('iframe').locator('#verification-code').textContent();

        // close new tab
        await newPage.close();

        await page.fill('#code', verificationCode);

        await Promise.all([
            page.waitForNavigation(), // wait for redirect
            page.click('button[title="Verify code"]')
        ]);
    }

    await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${user.fullName}`);
};

export const logout = async (page: Page) => {
    await page.click(PageModel.header.usernameButton);
    await page.click(PageModel.header.logoutButton);
    await page.waitForSelector(PageModel.header.loginButton);
    await expect(page.locator(PageModel.header.loginButton)).toBeVisible();
};

export const getPageAsUser = async (browser: Browser, user: TestUser = user1): Promise<Page> => {
    const userContext = await browser.newContext({ storageState: `playwright/.auth/user${users.indexOf(user)}.json` });
    return await userContext.newPage();
};
