import { expect, test, Page } from '@playwright/test';
import * as Type from '@types';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

export const publicationFlow = async (page: Page, type: Type.PublicationType) => {
    await page.goto(`${Helpers.UI_BASE}/create`);
    // title
    await page.locator(PageModel.publish.title).click();
    await page.keyboard.type('Testing publication type');
    // choose type
    await page.locator(PageModel.publish.publicationType).selectOption(type);
    // confirm >
    await page.locator(PageModel.publish.confirmPublicationType).click();
    await page.locator(PageModel.publish.createThisPublicationButton).click();
};

test.describe('Publication flow', () => {
    test('Pub flow', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();
        await page.goto(Helpers.UI_BASE);

        // Login
        await Helpers.login(page);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${process.env.ORCID_TEST_NAME}`);
        await publicationFlow(page, 'PROBLEM');
    });
});
