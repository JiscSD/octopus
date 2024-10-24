import * as Helpers from '../helpers';
import { BrowserContext, expect, Page, test } from '@playwright/test';
import { PageModel } from '../PageModel';

/**
 * These tests should run after publishing so that users have some LIVE and DRAFT publications
 */

test.describe('My account page', () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        page = await Helpers.users.getPageAsUser(browser);
        await page.goto(`/account`);
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('My account page filters are enabled by default', async () => {
        await expect(page.locator(`h1:has-text("${Helpers.users.user1.fullName}")`)).toBeVisible();

        const includeLiveVersion = page.locator('input#include-live-version');
        const includeDraftVersion = page.locator('input#include-draft-version');

        await expect(includeLiveVersion).toBeVisible();
        await expect(includeDraftVersion).toBeVisible();

        expect(await includeLiveVersion.isChecked()).toBe(true);
        expect(await includeDraftVersion.isChecked()).toBe(true);
    });

    test('My account page shows publications with LIVE and DRAFT versions by default', async () => {
        // check that there are publications with the message: 'Never published'
        await expect(page.getByText('Never published').first()).toBeVisible();

        // check that there are publications with LIVE versions
        await expect(page.getByText('1 published version').first()).toBeVisible();
    });

    test('My account page only shows publications with a LIVE version when DRAFT checkbox is unchecked', async () => {
        // check that there are publications with the message: 'Never published'
        await expect(page.getByText('Never published').first()).toBeVisible();

        // uncheck DRAFT
        const includeLiveVersion = page.locator('input#include-draft-version');
        await includeLiveVersion.uncheck();
        await page.waitForResponse((response) => response.url().includes('&versionStatus=LIVE') && response.ok());

        // check there's no publication with the message: 'Never published'
        await expect(page.getByText('Never published').first()).not.toBeVisible();
    });

    test('My account page only shows publications with a DRAFT version when LIVE checkbox is unchecked', async () => {
        // reset filters
        await page.reload();

        // check that there are publications with the button 'Create Draft Version'
        await expect(page.locator('button[title="Create Draft Version"]').first()).toBeVisible();

        // uncheck LIVE
        const includeLiveVersion = page.locator('input#include-live-version');
        await includeLiveVersion.uncheck();
        await page.waitForResponse(
            (response) => response.url().includes('&versionStatus=DRAFT,LOCKED') && response.ok()
        );

        // check there's no button 'Create Draft Version' anymore
        await expect(page.locator('button[title="Create Draft Version"]').first()).not.toBeVisible();
    });

    test('My account page displays publications with DRAFT and LIVE versions when both filters are unchecked', async () => {
        // reset filters
        await page.reload();

        // uncheck LIVE
        const includeLiveVersion = page.locator('input#include-live-version');
        await includeLiveVersion.uncheck();
        await page.waitForResponse(
            (response) => response.url().includes('&versionStatus=DRAFT,LOCKED') && response.ok()
        );

        // uncheck DRAFT
        const includeDraftVersion = page.locator('input#include-draft-version');
        await includeDraftVersion.uncheck();
        await page.waitForResponse((response) => response.url().includes('/publications?limit=') && response.ok());
    });
});
