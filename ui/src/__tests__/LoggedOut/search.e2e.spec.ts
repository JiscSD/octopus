import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('Check publication search, publication page, author page, browse page, logged out', () => {
    test('Search for a full publication title, partial publication title and no results, logged out', async ({
        browser
    }) => {
        // Start up test
        const page = await browser.newPage({ ignoreHTTPSErrors: true });
        await page.goto(Helpers.UI_BASE);

        // Navigate to search page
        await page.locator(PageModel.header.searchButton).click();
        await page.locator(PageModel.search.searchInput).click();

        // Type in search term
        await page.keyboard.type('How has life on earth evolved?');
        await page.keyboard.press('Enter');
        await expect(page.locator('h1')).toHaveText('Search results for How has life on earth evolved?');
        await expect(page.locator(PageModel.search.publicationSearchResult)).toBeVisible();

        // Click on search result
        await page.locator(PageModel.search.publicationSearchResult).click();
        await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');

        await page.goto(Helpers.UI_BASE);

        // Navigate to search page
        await page.locator(PageModel.header.searchButton).click();
        await page.locator(PageModel.search.searchInput).click();

        // Type in search term
        await page.keyboard.type('life evolved');
        await page.keyboard.press('Enter');
        await expect(page.locator('h1')).toHaveText('Search results for life evolved');
        await expect(page.locator(PageModel.search.publicationSearchResult)).toBeVisible();

        // Click on search result
        await page.locator(PageModel.search.publicationSearchResult).click();
        await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');

        await page.goto(Helpers.UI_BASE);

        // Navigate to search page
        await page.locator(PageModel.header.searchButton).click();
        await page.locator(PageModel.search.searchInput).click();

        // Type in search term
        await page.keyboard.type('thisShouldProduceNoResults');
        await page.keyboard.press('Enter');
        await expect(page.locator('h1')).toHaveText('Search results for thisShouldProduceNoResults');

        // Check for alert
        await expect(page.locator(PageModel.search.noPublicationsFound)).toBeVisible();

        await page.goto(Helpers.UI_BASE);

        // Navigate to search page
        await page.locator(PageModel.header.searchButton).click();

        // Test filters TODO
    });

    test('Check publication, author and browse page, logged out', async ({ browser }) => {
        // Start up test
        test.setTimeout(60000);
        const page = await browser.newPage({ ignoreHTTPSErrors: true });
        await page.goto(Helpers.UI_BASE);

        // Navigate to search page
        await page.locator(PageModel.header.searchButton).click();
        await page.locator(PageModel.search.searchInput).click();

        // Type in search term
        await page.keyboard.type('How has life on earth evolved?');
        await page.keyboard.press('Enter');
        await expect(page.locator('h1')).toHaveText('Search results for How has life on earth evolved?');
        await expect(page.locator(PageModel.search.publicationSearchResult)).toBeVisible();

        // Click on search result
        await page.locator(PageModel.search.publicationSearchResult).click();
        await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');

        // Check visualisation
        await expect(page.locator(PageModel.livePublication.visualisationProblem)).toBeVisible();

        // Check content, linked problems, funders, conflict of interest sections
        await expect(page.locator(PageModel.livePublication.content)).toBeVisible();
        await expect(page.locator(PageModel.livePublication.linkedProblems)).toBeVisible();
        await expect(page.locator(PageModel.livePublication.funders)).toBeVisible();
        await expect(page.locator(PageModel.livePublication.coi)).toBeVisible();

        // Expect licence and DOI link
        await expect(page.locator(PageModel.livePublication.licenceLink)).toHaveAttribute(
            'href',
            'https://creativecommons.org/licenses/by/4.0/'
        );
        await expect(page.locator(PageModel.livePublication.doiLink)).toHaveAttribute(
            'href',
            'https://doi.org/10.82259/cl3fz14dr0001es6i5ji51rq4'
        );

        // Check download pdf/json TODO

        // Check sign in for more button and that bookmark, flag link, review link are not visible
        await expect(page.locator(PageModel.livePublication.signInForMoreButton).locator('visible=true')).toBeVisible();
        await expect(page.locator(PageModel.livePublication.bookmark)).not.toBeVisible();
        await expect(page.locator(PageModel.livePublication.flagConcern)).not.toBeVisible();
        await expect(page.locator(PageModel.livePublication.writeReview)).not.toBeVisible();

        // Check and click author link
        await page.locator(PageModel.livePublication.authorLink).click();

        // Check name
        await expect(page.locator(PageModel.authorInfo.name)).toBeVisible();

        // Check ORCID link
        await expect(page.locator(PageModel.authorInfo.orcid)).toHaveAttribute(
            'href',
            'https://orcid.org/XXXX-XXXX-XXXX-XXXX'
        );

        // Check ORCID data sections
        for await (const orcidDataSection of PageModel.authorInfo.orcidData) {
            await expect(page.locator(orcidDataSection)).toBeVisible();
        }

        // Check Octopus publications section TODO/ change when we have test user
        // await page.locator(PageModel.authorInfo.showAll).click();
        // await expect(page.locator(PageModel.authorInfo.result).locator('visible=true')).toHaveCount(1059, {
        //     timeout: 55000
        // });

        await page.goto(Helpers.UI_BASE);

        // Navigate to browse page
        await page.locator(PageModel.header.browseButton).click();

        // Check links
        await expect(page.locator(PageModel.browse.viewAllPublications)).toHaveAttribute(
            'href',
            '/search?for=publications&type=PROBLEM,HYPOTHESIS,PROTOCOL,DATA,ANALYSIS,INTERPRETATION,REAL_WORLD_APPLICATION,PEER_REVIEW'
        );
        await expect(page.locator(PageModel.browse.viewAllAuthors)).toHaveAttribute('href', '/search?for=users');

        // Expect 5 cards
        await expect(page.locator(PageModel.browse.card).locator('visible=true')).toHaveCount(5);

        // Finish test
        await browser.close();
    });
});
