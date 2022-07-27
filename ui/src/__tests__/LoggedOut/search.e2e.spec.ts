import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

const UI_BASE = process.env.UI_BASE || 'https://localhost:3001';

test('Search for a publication', async ({ browser, context }) => {
    const page = await browser.newPage({ ignoreHTTPSErrors: true });
    await page.goto('https://localhost:3001');
    const search = page.locator(PageModel.header.searchButton);
    await search.click();

    // await expect(page.locator(`text=Quick search`)).toBeVisible;
    // await page.locator('css=[placeholder="Type here and press enter..."]').fill('How has life on earth evolved?');
    // const searchButton = page.locator(`css=[form=query-form`);
    // await searchButton.click();
    // await expect(page.locator(`href="/publications/cl3fz14dr0001es6i5ji51rq4"`)).toBeVisible;
});
