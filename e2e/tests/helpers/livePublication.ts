import { expect, Page } from '@playwright/test';
import { PageModel } from '../PageModel';

export const checkLivePublicationLayout = async (page: Page, id: string, loggedIn?: boolean) => {
    // Go to live publication page
    await page.goto(`/publications/${id}`, {
        waitUntil: 'networkidle'
    });
    await expect(page.locator('h1')).toBeVisible();

    // Check visualisation, content, linked problems, funders, conflict of interest sections
    for (const visibleSection of PageModel.livePublication.visibleSections) {
        await expect(page.locator(`${visibleSection}`).locator('visible=true')).toBeVisible();
    }

    // Expect DOI link
    await expect(page.getByRole('link', { name: 'DOI' })).toHaveAttribute(
        'href',
        `https://handle.test.datacite.org/10.82259/${id}`
    );

    if (loggedIn) {
        // Expect review link
        await expect(page.locator(PageModel.livePublication.writeReview).locator('visible=true')).toHaveAttribute(
            'href',
            `/create?for=${id}&type=PEER_REVIEW`
        );
    }
};
