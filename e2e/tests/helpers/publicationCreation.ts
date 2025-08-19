import { expect, Page } from '@playwright/test';
import { PageModel } from '../PageModel';
import * as users from './users';

export const createPublication = async (page: Page, publicationTitle: string, pubType: string) => {
    await page.goto(`/create`);
    // title
    await page.locator(PageModel.publish.title).click();
    await page.keyboard.type(publicationTitle);
    // choose type
    await page.locator(PageModel.publish.publicationType).selectOption(pubType);
    // confirm
    await page.locator(PageModel.publish.confirmPublicationType).click();

    await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.createThisPublicationButton).click()]);
};

export const completeKeyInformationTab = async (page: Page) => {
    // Key Information
    // Change license
    // This is no longer a field - there is only one license we want people to use.
    // We may want to reintroduce it one day, so commenting out.
    // await page.locator(PageModel.publish.keyInformation.license).selectOption(licenseType);
    await page.locator(PageModel.publish.nextButton).click();
};

export const completeAffiliationsTab = async (page: Page, isIndependentAuthor: boolean) => {
    if (isIndependentAuthor) {
        await page.click('#confirm-independent-author');
    } else {
        // add affiliations
        await page.locator('button[title="Add affiliation"]').nth(0).click();
    }

    await page.locator(PageModel.publish.nextButton).click();
};

export const completeLinkedItemsTab = async (page: Page, linkedPubSearchTerm: string, linkedPubTitle: string) => {
    // Linked pub
    await page.locator(PageModel.publish.linkedItems.publicationInput).click();
    await page.keyboard.type(linkedPubSearchTerm);
    await page.locator(`[role="option"]:has-text("${linkedPubTitle}")`).click();
    await Promise.all([
        page.waitForResponse((response) => response.url().includes('/links') && response.ok()),
        page.locator(PageModel.publish.linkedItems.addLink).click()
    ]);
    await expect(page.locator(PageModel.publish.linkedItems.deleteNewPublicationLink)).toBeVisible();

    await page.locator(PageModel.publish.nextButton).click();
};

export const completeMainTextTabMinimally = async (page: Page, mainText: string) => {
    await page.locator(PageModel.publish.text.editor).click();
    await page.keyboard.type(mainText);
    await page.locator(PageModel.publish.nextButton).click();
};

export const completeConflictOfInterestTab = async (
    page: Page,
    conflictOfInterest: boolean,
    conflictOfInterestText?: string
) => {
    await page.click("aside button:has-text('Conflict of interest')");

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

export const createPublishReadyPublication = async (page: Page, title?: string) => {
    await createPublication(page, title ?? 'Test publication', 'PROBLEM');
    await completeKeyInformationTab(page);
    await completeAffiliationsTab(page, true);
    await completeLinkedItemsTab(
        page,
        'living organisms',
        'How do living organisms function, survive, reproduce and evolve?'
    );
    await completeMainTextTabMinimally(page, 'Testing');
    await completeConflictOfInterestTab(page, false);
};

export interface AdditionalInformation {
    title: string;
    url: string;
    description?: string;
}

export interface Reference {
    text: string;
    refURL: string;
}

const addAdditionalInformation = async (page: Page, additionalInformation: AdditionalInformation) => {
    await page.locator(PageModel.publish.text.additionalInformation.title).click();
    await page.keyboard.type(additionalInformation.title);
    await page.locator(PageModel.publish.text.additionalInformation.url).click();
    await page.keyboard.type(additionalInformation.url);
    if (additionalInformation.description) {
        await page.locator(PageModel.publish.text.additionalInformation.description).click();
        await page.keyboard.type(additionalInformation.description);
    }
    await Promise.all([
        page.waitForResponse((response) => response.url().includes('/additional-information') && response.ok()),
        page.locator(PageModel.publish.text.additionalInformation.saveButton).click()
    ]);
};

const deleteAdditionalInformation = async (page: Page, url: string) => {
    await page
        .locator(PageModel.publish.text.additionalInformation.table)
        .locator('tr', { has: page.locator(`td:has-text('${url}')`) })
        .locator('button[title="Delete"]')
        .click();
};

const addReferences = async (page: Page, references: Array<Reference>) => {
    await page.locator(PageModel.publish.text.references).click();

    for (const reference of references) {
        await page.keyboard.type(`${reference.text} ${reference.refURL}`);
        await page.keyboard.press('Enter');
    }

    await page.locator(PageModel.publish.text.addReferencesButton).click();
};

const addASingleReference = async (page: Page, reference: Reference) => {
    await page.locator(PageModel.publish.text.addReferenceButton).click();

    await page.locator(PageModel.publish.text.continueModalButton).click();

    await page.locator('div[role=dialog] div[contenteditable=true]').click();

    await page.keyboard.type(`${reference.text}`);
    await page.keyboard.press('Tab');
    await page.keyboard.type(`${reference.refURL}`);
    await page.locator(PageModel.publish.text.saveReferenceModalButton).click();
};

const deleteFirstReference = async (page: Page) => {
    await page.locator(PageModel.publish.text.deleteFirstReferenceButton).click();
    await (await page.waitForSelector(PageModel.publish.text.deleteReferenceModalButton)).click();

    await page.waitForTimeout(300); // wait for modal to close
};

const deleteAllReferences = async (page: Page) => {
    await page.locator(PageModel.publish.text.deleteAllReferencesButton).click();

    (await page.waitForSelector(PageModel.publish.text.deleteAllReferencesModalButton)).click();

    await page.waitForTimeout(300); // wait for modal to close
};

export const completeMainTextTab = async (
    page: Page,
    mainText: string,
    additionalInformation: AdditionalInformation,
    language: string,
    references: Reference[],
    description: string,
    keywords: string
) => {
    // Text
    await page.locator(PageModel.publish.text.editor).click();
    await page.keyboard.type(mainText);
    // Additional information
    await addAdditionalInformation(page, additionalInformation);
    await expect(
        page
            .locator(PageModel.publish.text.additionalInformation.table)
            .locator('tr', { has: page.locator(`td:has-text("${additionalInformation.title}")`) })
    ).toBeVisible();
    await deleteAdditionalInformation(page, additionalInformation.url);
    await addAdditionalInformation(page, additionalInformation);
    // References
    await addReferences(page, references);
    await addASingleReference(page, references[1]);
    await deleteFirstReference(page);
    await deleteAllReferences(page);
    // re-add references
    await addReferences(page, references);
    await page.locator(PageModel.publish.text.language).selectOption(language);
    await page.locator(PageModel.publish.text.description).click();
    await page.keyboard.type(description);
    await page.locator(PageModel.publish.text.keywords).click();
    await page.keyboard.type(keywords);
    await page.locator(PageModel.publish.nextButton).click();
};

export const createLivePublication = async (page: Page, title?: string) => {
    await createPublishReadyPublication(page, title);
    await page.locator(PageModel.publish.publishButton).click();
    await Promise.all([
        page.waitForURL('**/versions/latest'),
        page.locator(PageModel.publish.confirmPublishButton).click()
    ]);

    return page.url();
};
