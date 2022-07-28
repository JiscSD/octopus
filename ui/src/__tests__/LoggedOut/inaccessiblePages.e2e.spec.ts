import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('Checking inaccessible pages', () => {
    test.skip('Logged out: Cannot access Publish', async ({ browser, context }) => {
        const page = await browser.newPage({ ignoreHTTPSErrors: true });
        await page.goto(Helpers.UI_BASE);
        await page.waitForNavigation();
        await expect(page).toHaveURL('https://orcid.org/');
    });
});
