import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('Check pages for: search, live publication, author, browse, profile', () => {
    test('Check publication, author and browse page, logged in', async ({ browser }) => {
        test.setTimeout(40000);
        // Start up test
        const page = await browser.newPage();
        await page.goto(Helpers.UI_BASE);

        // Login
        await Helpers.login(page);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${process.env.ORCID_TEST_NAME}`);

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

        // Confirm review link
        await expect(page.locator(PageModel.livePublication.writeReview).locator('visible=true')).toBeVisible();
        await page.locator(PageModel.livePublication.writeReview).locator('visible=true').click();
        await expect(page).toHaveURL(`${Helpers.UI_BASE}/create?for=cl3fz14dr0001es6i5ji51rq4&type=PEER_REVIEW`);
        await page.goBack();

        // Bookmark publication
        await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');
        await expect(page.locator(PageModel.livePublication.addBookmark)).toBeVisible();
        await page.locator(PageModel.livePublication.addBookmark).click();

        // Check in 'my bookmarks' page
        await page.locator(PageModel.header.usernameButton).click();
        await page.locator(PageModel.header.myBookmarksButton).click();
        await expect(page.locator(PageModel.myBookmarks.bookmark)).toContainText('How has life on earth evolved?');

        // Remove bookmark
        await page.goto(`${Helpers.UI_BASE}/publications/cl3fz14dr0001es6i5ji51rq4`);
        await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');
        await expect(page.locator(PageModel.livePublication.removeBookmark)).toBeVisible();
        await page.locator(PageModel.livePublication.removeBookmark).click();

        // Flag publication
        await expect(page.locator(PageModel.livePublication.flagConcern).locator('visible=true')).toBeVisible();
        await page.locator(PageModel.livePublication.flagConcern).locator('visible=true').click();
        await page.locator(PageModel.livePublication.redFlagComment).click();
        await page.keyboard.type('Testing the flagging functionality');
        await page.locator(PageModel.livePublication.redFlagSubmit).click();

        // Check flag and resolve flag
        await expect(page.locator(PageModel.livePublication.redFlagAlert)).toBeVisible();
        await page.locator(PageModel.livePublication.redFlagLink).click();
        await page.locator(PageModel.livePublication.redFlagPreview).click();
        await expect(page.locator('h1')).toHaveText('Plagiarism');
        await page.locator(PageModel.livePublication.resolveFlag).click();
        await page.locator(PageModel.livePublication.confirmResolve).locator('visible=true').click();
        await expect(page.locator(PageModel.livePublication.redFlagPreview)).not.toBeVisible();

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
    });
    test('Check browse and profile page, logged in', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();
        await page.goto(Helpers.UI_BASE);

        // Login
        await Helpers.login(page);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${process.env.ORCID_TEST_NAME}`);
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

        // Check my profile page
        await page.goto(Helpers.UI_BASE);
        await page.locator(PageModel.header.usernameButton).click();
        await page.locator(PageModel.header.myProfileButton).click();

        // Check name
        await expect(page.locator('h1')).toHaveText(`${process.env.ORCID_TEST_NAME}`);

        // Check ORCID data sections
        for await (const orcidDataSection of PageModel.authorInfo.orcidData) {
            await expect(page.locator(orcidDataSection)).toBeVisible();
        }

        // Finish test
        await browser.close();
    });
});
