import { expect, test } from '@playwright/test';
import { PageModel } from '../PageModel';

test.describe('Crosslinking', () => {
    test('Navigate via a crosslink', async ({ browser }) => {
        const page = await browser.newPage();
        await page.goto('/publications/publication-user-5-analysis-1-live');

        // Check contents of related publications sidebar.
        await expect(page.locator(PageModel.crosslinks.relatedPublicationsSidebar.toggle)).toHaveAttribute(
            'aria-expanded',
            'true'
        );
        const relatedPublicationsSidebar = page.locator('#desktop-related-publications-items');
        // Crosslinked publication is shown.
        await expect(
            relatedPublicationsSidebar.getByText(
                'What is the connection between human needs and sustainable development?'
            )
        ).toBeVisible();
        const crosslinkedPublicationCard = relatedPublicationsSidebar.locator('section > div');
        await expect(crosslinkedPublicationCard).toHaveCount(1);
        await expect(
            page.locator(PageModel.crosslinks.relatedPublicationsSidebar.suggestLinkButtonLoggedOut)
        ).toBeVisible();

        // Visit crosslinked publication.
        await crosslinkedPublicationCard.getByRole('link').click();
        await page.waitForURL(
            '/publications/publication-user-1-problem-1-live/versions/latest?suggestedFrom=publication-user-5-analysis-1-live'
        );

        // Check presence of voting area.
        await expect(page.getByText('You have navigated to this publication via a link from')).toBeVisible();
        for (const button of [
            page.locator(PageModel.crosslinks.votingArea.upvoteButton),
            page.locator(PageModel.crosslinks.votingArea.downvoteButton)
        ]) {
            await expect(button).toBeVisible();
            await expect(button).toBeDisabled();
        }
        await page.getByRole('link', { name: 'Return to previous publication' }).click();
        await page.waitForURL('/publications/publication-user-5-analysis-1-live/versions/latest');
    });

    test('View all crosslinks of a publication', async ({ browser }) => {
        const page = await browser.newPage();
        await page.goto('/publications/publication-user-1-problem-1-live');

        // Open view all modal.
        const relatedPublicationsSidebar = page.locator('#desktop-related-publications-items');
        await relatedPublicationsSidebar.getByRole('button', { name: 'View all' }).click();

        // Check elements.
        await expect(page.getByRole('heading', { name: 'Related Publications' })).toBeVisible();
        await expect(page.getByLabel('Search for suggested links')).toBeVisible();
        await expect(page.getByRole('group', { name: 'Sort by' })).toBeVisible();
        const radios = page.getByRole('radio');
        await expect(radios).toHaveCount(2);
        const orderByRecency = page.getByRole('radio', { name: 'Most recent' });
        await expect(orderByRecency).toBeChecked();
        const orderByRelevance = page.getByRole('radio', { name: 'Most relevant' });
        await expect(orderByRelevance).not.toBeChecked();
        // 4 results per page.
        await expect(page.getByRole('link', { name: 'Visit publication' })).toHaveCount(4);
        await expect(page.getByText(/Showing 1 - 4 of \d+/)).toBeVisible();
        // Expect 6 total results (i.e. more than 1 page).
        const prevButton = page.getByRole('button', { name: 'Previous' });
        const nextButton = page.getByRole('button', { name: 'Next' });
        await expect(prevButton).toBeDisabled();
        await expect(nextButton).toBeEnabled();
        // Use pagination.
        await nextButton.click();
        await page.waitForResponse((response) => response.url().includes('/crosslinks') && response.ok());
        await expect(page.getByRole('link', { name: 'Visit publication' })).toHaveCount(2);
        await expect(prevButton).toBeEnabled();
        await expect(nextButton).toBeDisabled();
        await prevButton.click();
        await expect(page.getByRole('link', { name: 'Visit publication' })).toHaveCount(4);
        // Change order.
        await expect(page.getByRole('link', { name: 'Visit publication' }).first()).toHaveAttribute(
            'href',
            '/publications/publication-user-7-peer-review-1-live?suggestedFrom=publication-user-1-problem-1-live'
        );
        await orderByRelevance.click();
        await page.waitForResponse((response) => response.url().includes('/crosslinks') && response.ok());
        await expect(orderByRecency).not.toBeChecked();
        await expect(orderByRelevance).toBeChecked();
        await expect(page.getByRole('link', { name: 'Visit publication' }).first()).toHaveAttribute(
            'href',
            '/publications/publication-user-7-problem-1-live?suggestedFrom=publication-user-1-problem-1-live'
        );
        // Filter results.
        await page.getByLabel('Search for suggested links').fill('complicated');
        await page.waitForResponse((response) => response.url().includes('/crosslinks') && response.ok());
        await expect(page.getByRole('link', { name: 'Visit publication' })).toHaveCount(1);
        await expect(page.getByRole('link', { name: 'Visit publication' }).first()).toHaveAttribute(
            'href',
            '/publications/publication-user-5-data-1-live?suggestedFrom=publication-user-1-problem-1-live'
        );
        await page.getByLabel('Search for suggested links').clear();
        await page.waitForResponse((response) => response.url().includes('/crosslinks') && response.ok());
        await expect(page.getByRole('link', { name: 'Visit publication' })).toHaveCount(4);
    });
});
