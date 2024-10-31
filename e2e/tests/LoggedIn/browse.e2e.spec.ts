import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('Browse', () => {
    test('Browse contents', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser, Helpers.users.user2);
        await page.goto('/');
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${Helpers.users.user2.fullName}`);

        // Navigate to browse page
        await page.locator(PageModel.header.browseButton).click();

        // Check links
        await expect(page.locator(PageModel.browse.viewAllPublications)).toHaveAttribute(
            'href',
            '/search/publications?type=PROBLEM,HYPOTHESIS,PROTOCOL,DATA,ANALYSIS,INTERPRETATION,REAL_WORLD_APPLICATION,PEER_REVIEW'
        );
        await expect(page.locator(PageModel.browse.viewAllAuthors)).toHaveAttribute('href', '/search/authors');

        // Expect 5 cards
        await expect(page.locator(PageModel.browse.card).locator('visible=true')).toHaveCount(5);
    });
});
