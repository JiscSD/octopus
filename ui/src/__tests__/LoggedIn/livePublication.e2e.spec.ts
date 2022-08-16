import { expect, test } from '@playwright/test';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

test.describe('Live Publication', () => {
    test('Live Publication page contents', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${process.env.ORCID_TEST_NAME}`);

        // Go to live publication page
        await page.goto(`${Helpers.UI_BASE}/publications/cl3fz14dr0001es6i5ji51rq4`, { waitUntil: 'domcontentloaded' });
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

        // Confirm review link
        await expect(page.locator(PageModel.livePublication.writeReview).locator('visible=true')).toBeVisible();
        await page.locator(PageModel.livePublication.writeReview).locator('visible=true').click();
        await expect(page).toHaveURL(`${Helpers.UI_BASE}/create?for=cl3fz14dr0001es6i5ji51rq4&type=PEER_REVIEW`);
        await page.goBack();
    });

    test('Bookmarking a publication', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${process.env.ORCID_TEST_NAME}`);
        await page.goto(`${Helpers.UI_BASE}/publications/cl3fz14dr0001es6i5ji51rq4`, { waitUntil: 'domcontentloaded' });

        // Bookmark publication
        await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');
        await expect(page.locator(PageModel.livePublication.addBookmark)).toBeVisible();
        await page.locator(PageModel.livePublication.addBookmark).click();

        // Check in 'my bookmarks' page
        await page.locator(PageModel.header.usernameButton).click();
        await page.locator(PageModel.header.myBookmarksButton).click();
        await expect(page.locator(PageModel.myBookmarks.bookmark)).toContainText('How has life on earth evolved?');

        // Remove bookmark
        await page.locator(PageModel.myBookmarks.bookmark).click();
        await page.waitForSelector('h1');
        await expect(page.locator('h1')).toHaveText('How has life on earth evolved?');
        await expect(page.locator(PageModel.livePublication.removeBookmark)).toBeVisible();
        await page.locator(PageModel.livePublication.removeBookmark).click();
    });
    test('Flagging a publication', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${process.env.ORCID_TEST_NAME}`);
        await page.goto(`${Helpers.UI_BASE}/publications/cl3fz14dr0001es6i5ji51rq4`, { waitUntil: 'domcontentloaded' });

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
    });
    test('Author profile', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${process.env.ORCID_TEST_NAME}`);
        await page.goto(`${Helpers.UI_BASE}/publications/cl3fz14dr0001es6i5ji51rq4`, { waitUntil: 'domcontentloaded' });

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

        // Check Author publications section
        await page.locator(PageModel.authorInfo.showAll).click();
        await page.waitForSelector(PageModel.authorInfo.result);
        await expect(page.locator(PageModel.authorInfo.result)).toBeVisible();
    });

    test.skip('Download pdf/json', async ({ browser }) => {
        // test TODO
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${process.env.ORCID_TEST_NAME}`);
        await page.goto(`${Helpers.UI_BASE}/publications/cl3fz14dr0001es6i5ji51rq4`, { waitUntil: 'domcontentloaded' });
    });
});
