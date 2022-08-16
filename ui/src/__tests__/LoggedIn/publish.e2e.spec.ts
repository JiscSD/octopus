import { expect, test, Page } from '@playwright/test';
import * as Type from '@types';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

export const publicationFlow = async (page: Page, pubType: Type.PublicationType, licenceType: Type.LicenceType) => {
    await page.goto(`${Helpers.UI_BASE}/create`);
    // title
    await page.locator(PageModel.publish.title).click();
    await page.keyboard.type('Testing publication type');
    // choose type
    await page.locator(PageModel.publish.publicationType).selectOption(pubType);
    // confirm >
    await page.locator(PageModel.publish.confirmPublicationType).click();
    await page.locator(PageModel.publish.createThisPublicationButton).click();

    // Key Information
    // Change licence
    await page.locator(PageModel.publish.keyInformation.licence).selectOption(licenceType);
    // Add ROR ID affiliation
    await page.locator(PageModel.publish.keyInformation.rorID).click();
    await page.keyboard.type('01rv9gx86');
    await page.locator(PageModel.publish.keyInformation.addAffiliationButton).click();
    // Add Manual affiliation
    await page.locator(PageModel.publish.keyInformation.manualAffiliationSelect).click();
    await page.locator(PageModel.publish.keyInformation.manualAffiliationName).click();
    await page.keyboard.type('Test name');
    await page.locator(PageModel.publish.keyInformation.manualAffiliationCity).click();
    await page.keyboard.type('Test city');
    await page.locator(PageModel.publish.keyInformation.manualAffiliationLink).click();
    await page.keyboard.type('Testaffiliation.com');
    await page.locator(PageModel.publish.keyInformation.addAffiliationButton).click();

    // Further info on affiliations
    await page.locator(PageModel.publish.keyInformation.affiliationDetails).click();
    await page.keyboard.type('Extra details for affiliation information testing');

    await page.locator(PageModel.publish.nextButton).click();

    // Linked pub
    await page.locator(PageModel.publish.linkedPub.input).click();
    await page.keyboard.type('living organisms');
    await page.locator(PageModel.publish.linkedPub.searchResult).click();
    await page.locator(PageModel.publish.linkedPub.addLink).click();

    await page.locator(PageModel.publish.nextButton).click();

    // Text
    await page.locator(PageModel.publish.text.editor).click();
    await page.keyboard.type('testing main text');
    await page.locator(PageModel.publish.text.language).selectOption('aa');
    await page.locator(PageModel.publish.text.description).click();
    await page.keyboard.type('testing description');
    await page.locator(PageModel.publish.text.keywords).click();
    await page.keyboard.type('testing keywords');

    await page.locator(PageModel.publish.nextButton).click();

    // COI
    await page.locator(PageModel.publish.coi.false).click();

    await page.locator(PageModel.publish.nextButton).click();
    // Funders
    await page.pause();
    // Co authors
    // Review and publish
};

test.describe('Publication flow', () => {
    test('Pub flow', async ({ browser }) => {
        test.slow();
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${process.env.ORCID_TEST_NAME}`);
        await publicationFlow(page, 'PROBLEM', 'CC_BY_NC');
    });
});
