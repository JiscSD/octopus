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

export const publicationFlowLinkedPublication = async (
    page: Page,
    linkedPubSearchTerm: string,
    linkedPubTitle: string
) => {
    // Linked pub
    await page.locator(PageModel.publish.linkedPub.input).click();
    await page.keyboard.type(linkedPubSearchTerm);
    await page.locator(`[role="option"]:has-text("${linkedPubTitle}")`).click();
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
    rorId: string,
    rorName: string,
    rorCity: string,
    rorLink: string,
    extraDetails: string
) => {
    // Funders
    // Add ROR ID funder
    await page.locator(PageModel.publish.funders.rorID).click();
    await page.keyboard.type(rorId);
    await page.locator(PageModel.publish.funders.addAffiliationButton).click();
    // Add Manual funder
    await page.locator(PageModel.publish.funders.manualAffiliationSelect).click();
    await page.locator(PageModel.publish.funders.manualAffiliationName).click();
    await page.keyboard.type(rorName);
    await page.locator(PageModel.publish.funders.manualAffiliationCity).click();
    await page.keyboard.type(rorCity);
    await page.locator(PageModel.publish.funders.manualAffiliationLink).click();
    await page.keyboard.type(rorLink);
    await page.locator(PageModel.publish.funders.addAffiliationButton).click();

    // Further info on funders
    await page.locator(PageModel.publish.keyInformation.affiliationDetails).click();
    await page.keyboard.type(extraDetails);

    await page.locator(PageModel.publish.nextButton).click();
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

const problemPublication = {
    pubType: 'PROBLEM',
    language: 'Afar',
    licence: 'CC BY-NC 4.0',
    title: 'test title',
    author: `${process.env.ORCID_TEST_NAME}`,
    text: 'main text',
    coi: 'This Research Problem does not have any specified conflicts of interest.',
    funding: 'This Research Problem has the following sources of funding:',
    fundingExtraDetails: 'extra details'
};

interface PublicationTestType {
    pubType: string;
    language: string;
    licence: string;
    title: string;
    author: string;
    text: string;
    coi: string;
    funding: string;
    fundingExtraDetails: string;
}

export const checkPublication = async (page: Page, publication: PublicationTestType) => {
    const publicationTemplate = (publication: PublicationTestType): string[] => [
        `text=${publication.pubType}`,
        `text=${publication.language}`,
        `text=${publication.licence}`,
        `main > section > header > p > a:has-text("${process.env.ORCID_TEST_NAME}")`,
        `h1:has-text("${publication.title}")`,
        `text=${publication.coi}`,
        `text=${publication.funding}`,
        `text=${publication.fundingExtraDetails}`
    ];

    for await (const publicationContent of publicationTemplate(publication)) {
        await expect(page.locator(`${publicationContent}`).locator('visible=true')).toBeVisible();
    }
};

test.describe('Publication flow', () => {
    test('Create a problem (standard publication)', async ({ browser }) => {
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
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );
        await publicationFlowMainText(page, 'main text', 'aa', 'description', 'key, words');
        await publicationFlowConflictOfInterest(page, false);
        await publicationFlowFunders(page, '01rv9gx86', 'funder name', 'funder city', 'funder.com', 'extra details');

        // Preview and check preview draft publication
        await page.locator(PageModel.publish.nextButton).click();
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, problemPublication);

        // Publish and check live publication
        await page.pause();
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.locator(PageModel.publish.publishButton).click();
        await page.locator(PageModel.publish.confirmPublishButton).click();
        await checkPublication(page, problemPublication);
    });
});
