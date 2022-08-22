import { expect, test, Page } from '@playwright/test';
import * as Type from '@types';
import * as Helpers from '../helpers';
import { PageModel } from '../PageModel';

export const createPublication = async (page: Page, publicationTitle: string, pubType: Type.PublicationType) => {
    await page.goto(`${Helpers.UI_BASE}/create`);
    // title
    await page.locator(PageModel.publish.title).click();
    await page.keyboard.type(publicationTitle);
    // choose type
    await page.locator(PageModel.publish.publicationType).selectOption(pubType);
    // confirm
    await page.locator(PageModel.publish.confirmPublicationType).click();
    await page.locator(PageModel.publish.createThisPublicationButton).click();
};

export const publicationFlowKeyInformation = async (
    page: Page,
    licenceType: Type.LicenceType,
    rorId: string,
    rorName: string,
    rorCity: string,
    rorLink: string,
    extraDetails: string
) => {
    // Key Information
    // Change licence
    await page.locator(PageModel.publish.keyInformation.licence).selectOption(licenceType);
    // Add ROR ID affiliation
    await page.locator(PageModel.publish.keyInformation.rorID).click();
    await page.keyboard.type(rorId);
    await page.locator(PageModel.publish.keyInformation.addAffiliationButton).click();
    // Add Manual affiliation
    await page.locator(PageModel.publish.keyInformation.manualAffiliationSelect).click();
    await page.locator(PageModel.publish.keyInformation.manualAffiliationName).click();
    await page.keyboard.type(rorName);
    await page.locator(PageModel.publish.keyInformation.manualAffiliationCity).click();
    await page.keyboard.type(rorCity);
    await page.locator(PageModel.publish.keyInformation.manualAffiliationLink).click();
    await page.keyboard.type(rorLink);
    await page.locator(PageModel.publish.keyInformation.addAffiliationButton).click();

    // Further info on affiliations
    await page.locator(PageModel.publish.keyInformation.affiliationDetails).click();
    await page.keyboard.type(extraDetails);

    await page.locator(PageModel.publish.nextButton).click();
};

export const publicationFlowLinkedPublication = async (page: Page, linkedPubSearchTerm: string) => {
    // Linked pub
    await page.locator(PageModel.publish.linkedPub.input).click();
    await page.keyboard.type(linkedPubSearchTerm);
    await page.locator(PageModel.publish.linkedPub.searchResult).click();
    await page.locator(PageModel.publish.linkedPub.addLink).click();

    await page.locator(PageModel.publish.nextButton).click();
};

export const publicationFlowMainText = async (
    page: Page,
    mainText: string,
    language: Type.Languages,
    description: string,
    keywords: string
) => {
    // Text
    await page.locator(PageModel.publish.text.editor).click();
    await page.keyboard.type(mainText);
    await page.locator(PageModel.publish.text.language).selectOption(language);
    await page.locator(PageModel.publish.text.description).click();
    await page.keyboard.type(description);
    await page.locator(PageModel.publish.text.keywords).click();
    await page.keyboard.type(keywords);

    await page.locator(PageModel.publish.nextButton).click();
};

export const publicationFlowConflictOfInterest = async (
    page: Page,
    conflictOfInterest: boolean,
    conflictOfInterestText?: string
) => {
    // COI
    if (conflictOfInterest) {
        await page.locator(PageModel.publish.coi.true).click();
        await expect(page.locator(PageModel.publish.coi.TextBox)).toBeVisible();
        await page.locator(PageModel.publish.coi.TextBox).click();
        if (conflictOfInterestText) {
            await page.keyboard.type(conflictOfInterestText);
        }
    } else {
        await page.locator(PageModel.publish.coi.false).click();
    }

    await page.locator(PageModel.publish.nextButton).click();
};

export const publicationFlowFunders = async (
    page: Page,
    pubType: Type.PublicationType,
    licenceType: Type.LicenceType
) => {
    // Funders
};

export const publicationFlowCoauthors = async (
    page: Page,
    pubType: Type.PublicationType,
    licenceType: Type.LicenceType
) => {
    // Co authors
};

export const publicationFlowReview = async (
    page: Page,
    pubType: Type.PublicationType,
    licenceType: Type.LicenceType
) => {
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

        await createPublication(page, 'test title', 'PROBLEM');
        await publicationFlowKeyInformation(
            page,
            'CC_BY_NC',
            '01rv9gx86',
            'ror name',
            'ror city',
            'ror.com',
            'extra details'
        );
        await publicationFlowLinkedPublication(page, 'living organisms');
        await publicationFlowMainText(page, 'main text', 'aa', 'description', 'key, words');
        await publicationFlowConflictOfInterest(page, false);
    });
});
