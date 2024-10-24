import { test as setup } from '@playwright/test';
import * as Helpers from '../helpers';

/**
 * For each test user defined in our helpers, log in and save the storage state to a file that can be reused
 * by tests that need a page logged in as one of these users.
 */
setup('Log in users', async ({ browser }) => {
    await Promise.all(
        Helpers.users.users.map(async (user, idx) => {
            const page = await browser.newPage();
            await Helpers.users.login(page, browser, user);
            await page.context().storageState({ path: `${Helpers.constants.STORAGE_STATE_BASE}user${idx}.json` });
            await page.close();
        })
    );
});
