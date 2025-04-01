import { expect, test } from '@playwright/test';
import { PageModel } from '../PageModel';

test.describe('User profiles', () => {
    test('Visit an author profile', async ({ browser }) => {
        const page = await browser.newPage();
        await page.goto(`/publications/publication-user-6-hypothesis-1-live`, { waitUntil: 'domcontentloaded' });

        // Check and click author link
        await page.getByRole('link', { name: 'G. Murphy' }).click();
        await page.waitForURL(`/authors/test-user-6-grace-murphy`);

        // Check name
        await expect(page.locator(PageModel.authorInfo.name)).toBeVisible();

        // Check ORCID data sections
        for await (const orcidDataSection of PageModel.profilePage.orcidDataSections) {
            await expect(page.locator(orcidDataSection)).toBeVisible();
        }

        // Check publications section
        await expect(page.locator(PageModel.organisationalUserInfo.octopusPublications)).toBeVisible();
    });

    test("Explore a user's publications", async ({ browser }) => {
        const page = await browser.newPage();
        // navigate to Octopus profile page
        await page.goto(`/authors/octopus`, {
            waitUntil: 'domcontentloaded'
        });
        await expect(page).toHaveTitle('Author: Octopus - Octopus | Built for Researchers');
        // Check user name.
        await expect(page.locator('h1')).toHaveText('Octopus');

        const octopusPublicationsHeader = page.locator(PageModel.organisationalUserInfo.octopusPublications);
        await expect(octopusPublicationsHeader).toBeVisible();
        const octopusPublicationsSection = octopusPublicationsHeader.locator('xpath=..');

        // Initially, 20 publications should be visible.
        await expect(await octopusPublicationsSection.locator('a').count()).toEqual(20);
        await expect(page.getByText(/Showing 1 - 20 of \d+/)).toBeVisible();

        // Change page size.
        await page.getByLabel('Showing').selectOption('10');
        await page.waitForResponse(
            (response) =>
                response.request().method() === 'GET' &&
                response.url().includes('/users/octopus/publications?offset=0&limit=10')
        );
        await expect(await octopusPublicationsSection.locator('a').count()).toEqual(10);
        await expect(page.getByText(/Showing 1 - 10 of \d+/)).toBeVisible();

        // Change page.
        await octopusPublicationsSection.getByLabel('Next').click();
        await page.waitForResponse(
            (response) =>
                response.request().method() === 'GET' &&
                response.url().includes('/users/octopus/publications?offset=10&limit=10')
        );
        await expect(page.getByText(/Showing 11 - 20 of \d+/)).toBeVisible();

        // Enter a query term and filter results.
        await octopusPublicationsSection.getByLabel('Quick search').fill('muco-cutaneous');
        await octopusPublicationsSection.getByRole('button', { name: 'Search' }).click();
        await page.waitForResponse(
            (response) =>
                response.request().method() === 'GET' &&
                response.url().includes('/users/octopus/publications?offset=0&limit=10&query=muco-cutaneous')
        );

        // Expect 1 result and disabled prev/next buttons.
        await expect(await octopusPublicationsSection.locator('a').count()).toEqual(1);
        await expect(octopusPublicationsSection.getByLabel('Previous')).toBeDisabled();
        await expect(octopusPublicationsSection.getByLabel('Next')).toBeDisabled();
    });
});
