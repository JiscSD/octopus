import * as Helpers from '../helpers';
import { expect, Page, test } from '@playwright/test';
import { PageModel } from '../PageModel';

test.describe('Science Octopus profile', () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        // navigate to Science Octopus profile page
        await page.goto(`/authors/octopus`, {
            waitUntil: 'domcontentloaded'
        });
        await expect(page).toHaveTitle('Author: XXXX-XXXX-XXXX-XXXX - Octopus | Built for Researchers');
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('Octopus publications pagination', async () => {
        // check user full name
        await expect(page.locator('h1')).toHaveText('Science Octopus');

        // check Octopus publications section
        const octopusPublicationsHeader = page.locator(PageModel.profilePage.octopusPublications);

        await expect(octopusPublicationsHeader).toBeVisible();

        await page.waitForLoadState('networkidle');

        const octopusPublicationsSection = octopusPublicationsHeader.locator('xpath=..');

        // initially, only 10 publications should be visible
        expect(await octopusPublicationsSection.locator('a[role=button]').count()).toEqual(10);

        // press "Show More" button to see more publications
        await expect(page.locator("'Show More'")).toBeVisible();
        await Promise.all([
            page.waitForResponse(
                (response) => response.url().includes('/users/octopus/publications?offset=10&limit=10') && response.ok()
            ),
            page.click("'Show More'")
        ]);

        // wait for publications to be rendered - 50ms per each
        await page.waitForTimeout(500);

        // the next 10 pubs should be loaded
        expect(await octopusPublicationsSection.locator('a[role=button]').count()).toEqual(20);

        // press "Show More" button again
        await Promise.all([
            page.waitForResponse(
                (response) => response.url().includes('/users/octopus/publications?offset=20&limit=10') && response.ok()
            ),
            page.click("'Show More'")
        ]);

        // wait for publications to be rendered - 50ms per each
        await page.waitForTimeout(500);

        // 30 publications should now be visible in the UI
        expect(await octopusPublicationsSection.locator('a[role=button]').count()).toEqual(30);
    });
});
