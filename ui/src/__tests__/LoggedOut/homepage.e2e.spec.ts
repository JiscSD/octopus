import { expect, test, chromium } from '@playwright/test';
import { PageModel } from '.././PageModel';
import * as Helpers from '../helpers';

test('Check homepage', async ({ browser }) => {
    // Start up test
    const page = await browser.newPage({ ignoreHTTPSErrors: true });
    await page.goto(Helpers.UI_BASE);

    // Expect elements to be visible
    await expect(page.locator('h1')).toHaveText(
        'Free, fast and fair: the global primary research record where researchers record their work in full detail'
    );
    await expect(page.locator(PageModel.header.loginButton)).toBeVisible();

    // Expect cards to be visible
    for await (const card of PageModel.homepage.cards) {
        await expect(page.locator(card)).toBeVisible();
    }

    // Expect links to be correct
    for await (const link of PageModel.footer.links) {
        await expect(page.locator(link)).toBeVisible();
    }

    // Check quick search command palette
    await page.locator(PageModel.homepage.quickSearch).click();
    await page.locator(PageModel.homepage.quickSearchInput).click();
    await page.keyboard.type('How has life on earth evolved?');
    await expect(page.locator(PageModel.homepage.publicationSearchResult)).toBeVisible();
    await page.keyboard.press('Enter');

    await expect(page.locator('h1')).toHaveText('Search results for How has life on earth evolved?');
    await page.goBack();

    // Check dark/light toggle - TODO, sort out localStorage
    // await page.locator(PageModel.homepage.darkModeToggle).click();
    await expect(page.locator('h1')).toHaveCSS('color', 'rgb(255, 255, 255)');

    await page.locator(PageModel.homepage.darkModeToggle).click();
    await expect(page.locator('h1')).toHaveCSS('color', 'rgb(52, 61, 76)');

    // Finish test
    await browser.close();
});
