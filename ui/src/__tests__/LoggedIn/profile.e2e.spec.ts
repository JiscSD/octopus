import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('My profile', () => {
    test('My profile contents', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${process.env.ORCID_TEST_NAME}`);

        // Check my profile page
        await page.goto(Helpers.UI_BASE);
        await page.locator(PageModel.header.usernameButton).click();
        await page.locator(PageModel.header.myProfileButton).click();

        // Check name
        await expect(page.locator('h1')).toHaveText(`${process.env.ORCID_TEST_NAME}`);

        // Check ORCID data sections
        for await (const orcidDataSection of PageModel.authorInfo.orcidData) {
            await expect(page.locator(orcidDataSection)).toBeVisible();
        }
    });
});
