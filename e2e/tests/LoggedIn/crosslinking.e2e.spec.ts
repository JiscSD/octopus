import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('Crosslinking', () => {
    test('Create a crosslink', async ({ browser }) => {
        const targetPublicationTitle = 'Organisational account publication 1';
        const page = await Helpers.users.getPageAsUser(browser);
        // Create new publication
        await Helpers.publicationCreation.createLivePublication(page, 'Creating a crosslink');
        // Open suggest crosslink modal
        await page.locator(PageModel.crosslinks.suggestModal.openButtonLoggedIn).click();
        await page.waitForSelector(PageModel.crosslinks.suggestModal.searchInput);
        // Search for existing publication and select it
        await page.locator(PageModel.crosslinks.suggestModal.searchInput).click();
        await page.keyboard.type(targetPublicationTitle);
        await page.locator(`[role="option"]:has-text("${targetPublicationTitle}")`).click();
        await expect(page.locator(PageModel.crosslinks.suggestModal.clearSelectionButton)).toBeVisible();
        await expect(page.locator(PageModel.crosslinks.suggestModal.searchInput)).toHaveValue(targetPublicationTitle);
        // Clear selection
        await page.locator(PageModel.crosslinks.suggestModal.clearSelectionButton).click();
        await page.waitForSelector(PageModel.crosslinks.suggestModal.clearSelectionButton, {
            state: 'hidden'
        });
        await expect(page.getByText(targetPublicationTitle)).toHaveCount(0);
        // Re-select target publication
        await page.locator(PageModel.crosslinks.suggestModal.searchInput).click();
        await page.keyboard.type(targetPublicationTitle);
        await page.locator(`[role="option"]:has-text("${targetPublicationTitle}")`).click();
        // Save suggestion
        await Promise.all([
            page.waitForResponse((response) => response.url().includes('/crosslinks') && response.ok()),
            page.locator(PageModel.crosslinks.suggestModal.suggestButton).click()
        ]);
        await expect(page.getByText('Suggestion created')).toBeVisible();
        // Check that crosslink is present on new publication's page
        await expect(
            page.locator('#desktop-related-publications-items').getByText(targetPublicationTitle)
        ).toBeVisible();
    });

    test('Vote on a crosslink', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await page.goto('/publications/publication-user-5-analysis-1-live');

        // Navigate via crosslink.
        await page
            .locator('#desktop-related-publications-items')
            .getByRole('link', { name: 'View this publication' })
            .click();
        await page.waitForURL(
            '/publications/publication-user-1-problem-1-live/versions/latest?suggestedFrom=publication-user-5-analysis-1-live'
        );

        const upvoteButton = page.locator(PageModel.crosslinks.votingArea.upvoteButton);
        const downvoteButton = page.locator(PageModel.crosslinks.votingArea.downvoteButton);

        // If the votes aren't at their initial value, reset them for the test.
        if ((await upvoteButton.textContent()) !== '1') {
            await upvoteButton.click();
        }
        if ((await downvoteButton.textContent()) !== '4') {
            await downvoteButton.click();
        }
        await expect(await upvoteButton.textContent()).toBe('1');
        await expect(await downvoteButton.textContent()).toBe('4');

        // Upvote first.
        await upvoteButton.click();
        await expect(await upvoteButton.textContent()).toBe('2');

        // Cancel vote.
        await upvoteButton.click();
        await expect(await upvoteButton.textContent()).toBe('1');

        // Downvote.
        await downvoteButton.click();
        await expect(await downvoteButton.textContent()).toBe('5');

        // Cancel vote.
        await downvoteButton.click();
        await expect(await downvoteButton.textContent()).toBe('4');

        // Make a vote and swap it.
        await upvoteButton.click();
        await expect(await upvoteButton.textContent()).toBe('2');
        await downvoteButton.click();
        await expect(await downvoteButton.textContent()).toBe('5');
        await expect(await upvoteButton.textContent()).toBe('1');
    });
});
