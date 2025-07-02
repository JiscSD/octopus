import { expect, Page, test } from '@playwright/test';
import * as Helpers from '../helpers';

const addPublicationToBundle = async (page: Page, queryTerm: string, publicationTitle: string) => {
    await page.getByRole('combobox', { name: 'Search for publications' }).click();
    await page.keyboard.type(queryTerm);
    await page.getByRole('option', { name: publicationTitle }).click();
    // This looks weird but it is necessary - the button is disabled while it's thinking about the selection,
    // before being enabled when it's ready to add.
    await expect(page.getByRole('button', { name: 'Add to bundle' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Add to bundle' })).toBeEnabled();
    await page.getByRole('button', { name: 'Add to bundle' }).click();
    // Wait for publication to be present in table
    await page.waitForSelector(`td p:has-text("${publicationTitle}")`);
};

test.describe('Publication Bundles', () => {
    test('Create a publication bundle', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await page.goto('/bundles/create');
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Create new bundle');
        await expect(page.getByText('Save this bundle to create a shareable link')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
        // Enter name
        await page.getByRole('textbox', { name: 'Name' }).fill('Test Bundle');
        // Save should still be disabled - still need to add 2 publications
        await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
        await addPublicationToBundle(
            page,
            'acute',
            'Acute diverticulitis: Diverticular disease is very common in developed countries.'
        );
        await addPublicationToBundle(page, 'organisational', 'Organisational account publication 1');
        // Save should now be enabled
        await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
        // Delete second publication
        const row = await page
            .getByRole('row')
            .filter({ has: page.locator('p:has-text("Organisational account publication 1")') });
        await row.getByRole('button', { name: 'Delete' }).click();
        await page.getByRole('button', { name: 'Confirm' }).click();
        // Save should be disabled again
        await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled();
        // Add another publication
        await addPublicationToBundle(
            page,
            'tuberous',
            'Tuberous Sclerosis Complex (TSC) is a multisystem genetic disorder characterized by hamartomatous neurological lesions that exhibit abnormal cell proliferation and differentiation.'
        );
        // Save should now be enabled
        await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('Bundle created successfully')).toBeVisible();
        await page.close();
    });
});
