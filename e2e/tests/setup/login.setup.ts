import { existsSync } from 'fs';
import { test as setup } from '@playwright/test';
import * as Helpers from '../helpers';

/**
 * For each test user defined in our helpers, log in and save the storage state to a file that can be reused
 * by tests that need a page logged in as one of these users.
 */
setup('Log in users', async ({ browser }) => {
    await Promise.all(
        Helpers.users.map(async (user, idx) => {
            const storageStatePath = `${Helpers.STORAGE_STATE_BASE}user${idx}.json`;
            if (!existsSync(storageStatePath)) {
                const page = await browser.newPage();
                await Helpers.login(page, browser, user);
                // Minimise feedback popup
                await page.getByLabel('Open Close icon').click();
                await page.context().storageState({ path: storageStatePath });
            }
        })
    );
});
