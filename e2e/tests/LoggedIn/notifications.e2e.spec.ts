import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';

test.describe('Notifications', () => {
    test('View Notification Settings', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await page.goto('/notifications');

        expect(page.getByText('Notification settings')).toBeVisible();

        const enableBookmarkNotifications = page.getByLabel('Receive notifications for bookmarked publications');
        const enablePublicationNotifications = page.getByLabel('Receive notifications about new versions of bookmarked publications');

        expect(enableBookmarkNotifications).toBeVisible();
        expect(enablePublicationNotifications).toBeVisible();

        enableBookmarkNotifications.click();
        await expect(enableBookmarkNotifications).toBeChecked();
        await expect(enablePublicationNotifications).toBeChecked();

        expect (page.getByText('Bookmark notifications settings updated successfully')).toBeVisible();

        enableBookmarkNotifications.click();
        await expect(enableBookmarkNotifications).not.toBeChecked();
        await expect(enablePublicationNotifications).not.toBeChecked();

        expect(page.getByText('Bookmark notifications settings updated successfully')).toBeVisible();
    });
});
