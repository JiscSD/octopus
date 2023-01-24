import * as Helpers from '../helpers';
import { expect, test, Page, Browser } from '@playwright/test';
import { PageModel } from '../PageModel';

export const createPublication = async (page: Page, publicationTitle: string, pubType: string) => {
    await page.goto(`${Helpers.UI_BASE}/create`);
    // title
    await page.locator(PageModel.publish.title).click();
    await page.keyboard.type(publicationTitle);
    // choose type
    await page.locator(PageModel.publish.publicationType).selectOption(pubType);
    // confirm
    await page.locator(PageModel.publish.confirmPublicationType).click();
    await page.locator(PageModel.publish.createThisPublicationButton).click();
    await page.waitForNavigation();
};

export const publicationFlowKeyInformation = async (
    page: Page,
    licenceType: string,
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
    await page.getByText('Enter ROR ID').click();
    await page.getByLabel('Enter ROR ID').press('Tab');

    await page.keyboard.type(rorId, { delay: 100 });

    await Promise.all([
        page.waitForResponse(
            (response) =>
                response.request().method() === 'POST' && response.url().includes('/affiliation') && response.ok()
        ),
        page.locator(PageModel.publish.keyInformation.addAffiliationButton).click()
    ]);

    // Add Manual affiliation
    await page.locator(PageModel.publish.keyInformation.manualAffiliationSelect).click();

    await page.locator(PageModel.publish.keyInformation.manualAffiliationName).click();
    await page.keyboard.type(rorName);
    await page.keyboard.press('Tab');
    await page.keyboard.type(rorCity);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.type(rorLink);
    await Promise.all([
        page.waitForResponse(
            (response) =>
                response.request().method() === 'POST' && response.url().includes('/affiliation') && response.ok()
        ),
        page.locator(PageModel.publish.keyInformation.addAffiliationButton).click()
    ]);

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

interface Reference {
    text: string;
    refURL: string;
}

const referencesList: Array<Reference> = [
    {
        text: 'Pighin S, Savadori L, Barilli E, Cremonesi L',
        refURL: '(doi:10.1177/0272989X11403490)'
    },
    {
        text: 'Reyna, V.F. and Brainerd, C.J., 2008. Numeracy',
        refURL: 'https://www.testrefurl1234.com'
    }
];

export const publicationFlowMainText = async (
    page: Page,
    mainText: string,
    language: string,
    references: Array<Reference>,
    description: string,
    keywords: string
) => {
    // Text
    await page.locator(PageModel.publish.text.editor).click();
    await page.keyboard.type(mainText);
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

const addReferences = async (page: Page, references: Array<Reference>) => {
    await page.locator(PageModel.publish.text.references).click();

    for (const reference of references) {
        await page.keyboard.type(`${reference.text} ${reference.refURL}`);
        await page.keyboard.press('Enter');
    }

    await page.locator(PageModel.publish.text.addReferencesButton).click();
};

const deleteAllReferences = async (page: Page) => {
    await page.locator(PageModel.publish.text.deleteAllReferencesButton).click();

    (await page.waitForSelector(PageModel.publish.text.deleteAllReferencesModalButton)).click();

    await page.waitForTimeout(300); // wait for modal to close
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
    await Promise.all([
        page.waitForResponse((response) => response.url().includes('/funders') && response.ok()),
        page.locator(PageModel.publish.funders.addAffiliationButton).click()
    ]);

    // Add Manual funder
    await page.locator(PageModel.publish.funders.manualAffiliationSelect).click();
    await page.locator(PageModel.publish.funders.manualAffiliationName).click();
    await page.keyboard.type(rorName);
    await page.locator(PageModel.publish.funders.manualAffiliationCity).click();
    await page.keyboard.type(rorCity);
    await page.locator(PageModel.publish.funders.manualAffiliationLink).click();
    await page.keyboard.type(rorLink);
    await Promise.all([
        page.waitForResponse((response) => response.url().includes('/funders') && response.ok()),
        page.locator(PageModel.publish.funders.addAffiliationButton).click()
    ]);

    // Further info on funders
    await page.locator(PageModel.publish.keyInformation.affiliationDetails).click();
    await page.keyboard.type(extraDetails);

    await page.locator(PageModel.publish.nextButton).click();
};

export const publicationFlowReview = async (page: Page, pubType: string, licenceType: string) => {
    // Review and publish
};

const problemPublication = {
    pubType: 'Research Problem',
    language: 'Afar',
    licence: 'CC BY-NC 4.0',
    title: 'test title',
    author: Helpers.user1.fullName,
    text: 'main text',
    references: referencesList,
    coi: 'This Research Problem does not have any specified conflicts of interest.',
    funding: 'This Research Problem has the following sources of funding:',
    fundingExtraDetails: 'extra details'
};

const hypothesisPublication = {
    pubType: 'Rationale / Hypothesis',
    language: 'Afar',
    licence: 'CC BY-NC 4.0',
    title: 'test title',
    author: Helpers.user1.fullName,
    text: 'main text',
    references: referencesList,
    coi: 'This Rationale / Hypothesis does not have any specified conflicts of interest.',
    funding: 'This Rationale / Hypothesis has the following sources of funding:',
    fundingExtraDetails: 'extra details'
};

const methodPublication = {
    pubType: 'Method',
    language: 'Afar',
    licence: 'CC BY-NC 4.0',
    title: 'test title',
    author: Helpers.user1.fullName,
    text: 'main text',
    references: referencesList,
    coi: 'This Method does not have any specified conflicts of interest.',
    funding: 'This Method has the following sources of funding:',
    fundingExtraDetails: 'extra details'
};

const analysisPublication = {
    pubType: 'Analysis',
    language: 'Afar',
    licence: 'CC BY-NC 4.0',
    title: 'test title',
    author: Helpers.user1.fullName,
    text: 'main text',
    references: referencesList,
    coi: 'This Analysis does not have any specified conflicts of interest.',
    funding: 'This Analysis has the following sources of funding:',
    fundingExtraDetails: 'extra details'
};

const interpretationPublication = {
    pubType: 'Interpretation',
    language: 'Afar',
    licence: 'CC BY-NC 4.0',
    title: 'test title',
    author: Helpers.user1.fullName,
    text: 'main text',
    references: referencesList,
    coi: 'This Interpretation does not have any specified conflicts of interest.',
    funding: 'This Interpretation has the following sources of funding:',
    fundingExtraDetails: 'extra details'
};

const realWorldApplicationPublication = {
    pubType: 'Real World Application',
    language: 'Afar',
    licence: 'CC BY-NC 4.0',
    title: 'test title',
    author: Helpers.user1.fullName,
    text: 'main text',
    references: referencesList,
    coi: 'This Real World Application does not have any specified conflicts of interest.',
    funding: 'This Real World Application has the following sources of funding:',
    fundingExtraDetails: 'extra details'
};

interface PublicationTestType {
    pubType: string;
    language: string;
    licence: string;
    title: string;
    author: string;
    text: string;
    references: Array<Reference>;
    coi: string;
    funding: string;
    fundingExtraDetails: string;
}

export const checkPublication = async (page: Page, publication: PublicationTestType) => {
    const publicationTemplate = (publication: PublicationTestType): string[] => [
        `aside span:has-text("${publication.pubType}")`,
        `aside span:has-text("${publication.language}")`,
        `aside a:has-text("${publication.licence}")`,
        `main > section > header > div >> a:has-text("${Helpers.user1.shortName}")`,
        `h1:has-text("${publication.title}")`,
        `text=${publication.references[1].text}`,
        `text=${publication.references[1].refURL}`,
        `text=${publication.coi}`,
        `text=${publication.funding}`,
        `article p:has-text("${publication.fundingExtraDetails}")`
    ];

    await Promise.all(publicationTemplate(publication).map((selector) => expect(page.locator(selector)).toBeVisible()));
};

test.describe('Publication flow', () => {
    test('Create a problem (standard publication)', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        await createPublication(page, 'test title', 'PROBLEM');
        await publicationFlowKeyInformation(
            page,
            'CC_BY_NC',
            '01rv9gx86',
            'ror name',
            'ror city',
            'https://ror.com',
            'extra details'
        );
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );
        await publicationFlowMainText(page, 'main text', 'aa', referencesList, 'description', 'key, words');
        await publicationFlowConflictOfInterest(page, false);
        await publicationFlowFunders(
            page,
            '01rv9gx86',
            'funder name',
            'funder city',
            'https://funder.com',
            'extra details'
        );

        // Preview and check preview draft publication
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, problemPublication);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.waitForResponse((response) => response.url().includes('/reference') && response.ok());
        await page.locator(PageModel.publish.publishButton).click();

        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, problemPublication);
    });

    test('Create a hypothesis (standard publication)', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        await createPublication(page, 'test title', 'HYPOTHESIS');
        await publicationFlowKeyInformation(
            page,
            'CC_BY_NC',
            '01rv9gx86',
            'ror name',
            'ror city',
            'https://ror.com',
            'extra details'
        );
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );
        await publicationFlowMainText(page, 'main text', 'aa', referencesList, 'description', 'key, words');
        await publicationFlowConflictOfInterest(page, false);
        await publicationFlowFunders(
            page,
            '01rv9gx86',
            'funder name',
            'funder city',
            'https://funder.com',
            'extra details'
        );

        // Preview and check preview draft publication
        await page.locator(PageModel.publish.nextButton).click();
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, hypothesisPublication);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.waitForResponse((response) => response.url().includes('/reference') && response.ok());
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, hypothesisPublication);
    });

    test('Create a method (standard publication)', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        await createPublication(page, 'test title', 'PROTOCOL');
        await publicationFlowKeyInformation(
            page,
            'CC_BY_NC',
            '01rv9gx86',
            'ror name',
            'ror city',
            'https://ror.com',
            'extra details'
        );
        await publicationFlowLinkedPublication(
            page,
            'a',
            'Hypothesis of Improving the quality of life for sustainable'
        );
        await publicationFlowMainText(page, 'main text', 'aa', referencesList, 'description', 'key, words');
        await publicationFlowConflictOfInterest(page, false);
        await publicationFlowFunders(
            page,
            '01rv9gx86',
            'funder name',
            'funder city',
            'https://funder.com',
            'extra details'
        );

        // Preview and check preview draft publication
        await page.locator(PageModel.publish.nextButton).click();
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, methodPublication);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.waitForResponse((response) => response.url().includes('/reference') && response.ok());
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, methodPublication);
    });

    test('Create an analysis (standard publication)', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        await createPublication(page, 'test title', 'ANALYSIS');
        await publicationFlowKeyInformation(
            page,
            'CC_BY_NC',
            '01rv9gx86',
            'ror name',
            'ror city',
            'https://ror.com',
            'extra details'
        );
        await publicationFlowLinkedPublication(
            page,
            'a',
            'Data attached to Improving the quality of life for sustainable development'
        );
        await publicationFlowMainText(page, 'main text', 'aa', referencesList, 'description', 'key, words');
        await publicationFlowConflictOfInterest(page, false);
        await publicationFlowFunders(
            page,
            '01rv9gx86',
            'funder name',
            'funder city',
            'https://funder.com',
            'extra details'
        );

        // Preview and check preview draft publication
        await page.locator(PageModel.publish.nextButton).click();
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, analysisPublication);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.waitForResponse((response) => response.url().includes('/reference') && response.ok());
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, analysisPublication);
    });

    test('Create an interpretation (standard publication)', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        await createPublication(page, 'test title', 'INTERPRETATION');
        await publicationFlowKeyInformation(
            page,
            'CC_BY_NC',
            '01rv9gx86',
            'ror name',
            'ror city',
            'https://ror.com',
            'extra details'
        );
        await publicationFlowLinkedPublication(page, 'a', 'Analysis of Improving the quality of life for sustainable');
        await publicationFlowMainText(page, 'main text', 'aa', referencesList, 'description', 'key, words');
        await publicationFlowConflictOfInterest(page, false);
        await publicationFlowFunders(
            page,
            '01rv9gx86',
            'funder name',
            'funder city',
            'https://funder.com',
            'extra details'
        );

        // Preview and check preview draft publication
        await page.locator(PageModel.publish.nextButton).click();
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, interpretationPublication);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.waitForResponse((response) => response.url().includes('/reference') && response.ok());
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, interpretationPublication);
    });

    test('Create a real world application (standard publication)', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        await createPublication(page, 'test title', 'REAL_WORLD_APPLICATION');
        await publicationFlowKeyInformation(
            page,
            'CC_BY_NC',
            '01rv9gx86',
            'ror name',
            'ror city',
            'https://ror.com',
            'extra details'
        );
        await publicationFlowLinkedPublication(
            page,
            'a',
            'Interpretation of Improving the quality of life for sustainable'
        );
        await publicationFlowMainText(page, 'main text', 'aa', referencesList, 'description', 'key, words');
        await publicationFlowConflictOfInterest(page, false);
        await publicationFlowFunders(
            page,
            '01rv9gx86',
            'funder name',
            'funder city',
            'https://funder.com',
            'extra details'
        );

        // Preview and check preview draft publication
        await page.locator(PageModel.publish.nextButton).click();
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, realWorldApplicationPublication);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.waitForResponse((response) => response.url().includes('/reference') && response.ok());
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, realWorldApplicationPublication);
    });
});

const publicationWithCoAuthors = {
    title: 'Test co-authors',
    content: 'Testing co-authors',
    coAuthors: [Helpers.user2, Helpers.user3],
    type: 'PROBLEM'
};

const addCoAuthor = async (page: Page, user: Helpers.TestUser) => {
    await page.fill('input[type="email"]', user.email);
    await page.keyboard.press('Enter');
};

const removeCoAuthor = async (page: Page, user: Helpers.TestUser) => {
    const row = page.locator('tr', { hasText: user.email });
    await row.locator('button[title="Delete"]').click();
};

const confirmCoAuthorInvitation = async (browser: Browser, user: Helpers.TestUser) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(Helpers.UI_BASE);
    await Helpers.login(page, browser, user);
    const page2 = await context.newPage();
    await page2.goto(`http://localhost:8025/`);
    await page2.waitForSelector('.messages > .row');

    // click latest invitation link which was sent to this user and has text: "You’ve been added as a co-author on Octopus"
    await page2
        .locator(`.msglist-message:has-text("${user.email}")`, {
            hasText: 'You’ve been added as a co-author on Octopus'
        })
        .first()
        .click();

    // clicking 'I am an author' link is blocked by cors
    const invitationLink = await page2
        .frameLocator('iframe')
        .locator("a.button:has-text('I am an author')")
        .getAttribute('href');

    // navigate to that link instead
    const page3 = await context.newPage();
    await page3.goto(invitationLink);
    await (await page3.waitForSelector('button:has-text("approve")')).click();

    await (await page3.waitForSelector('button[title="Yes, this is ready to publish"]')).click();

    await page3.waitForSelector('button:has-text("change your mind")');
    await context.close();
};

const rejectCoAuthorInvitation = async (browser: Browser, user: Helpers.TestUser) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(Helpers.UI_BASE);
    await Helpers.login(page, browser, user);
    const page2 = await context.newPage();
    await page2.goto(`http://localhost:8025/`);
    await page2.waitForSelector('.messages > .row');

    // click latest invitation link which was sent to this user and has text: "You’ve been added as a co-author on Octopus"
    await page2
        .locator(`.msglist-message:has-text("${user.email}")`, {
            hasText: 'You’ve been added as a co-author on Octopus'
        })
        .first()
        .click();

    // clicking 'I am not an author' link is blocked by cors
    const invitationLink = await page2
        .frameLocator('iframe')
        .locator("a.button:has-text('I am not an author')")
        .getAttribute('href');

    // navigating to 'I am not an author link' will remove this co-author from the publication
    const page3 = await context.newPage();
    await page3.goto(invitationLink);
    await page3.waitForLoadState('load');
    await context.close();
};

const verifyLastEmailNotification = async (browser: Browser, user: Helpers.TestUser, emailSubject: string) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://localhost:8025/');
    // verify last notification sent to this email
    await expect(page.locator(`.msglist-message:has-text("${user.email}")`).first()).toContainText(emailSubject);
    await context.close();
};

test.describe('Publication flow + co-authors', () => {
    test.describe.configure({ mode: 'serial' });

    test('Create a PROBLEM publication with co-authors', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked publications')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // verify 'Publish' button is enabled
        const publishButton = page.locator(PageModel.publish.publishButton);
        await expect(publishButton).toBeEnabled();

        // add co-authors
        await page.locator('aside button:has-text("Co-authors")').click();
        await addCoAuthor(page, Helpers.user2);
        await addCoAuthor(page, Helpers.user3);

        // verify 'Publish' button is now request approval button
        const requestApprovalButton = page.locator(PageModel.publish.requestApprovalButton);
        await expect(requestApprovalButton).toBeEnabled();

        // Request approval from co authors
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();

        // first co-author confirmation
        await confirmCoAuthorInvitation(browser, Helpers.user2);

        // verify notification triggered after first confirmation
        await verifyLastEmailNotification(browser, Helpers.user1, 'A co-author has approved your Octopus publication');

        // second co-author confirmation
        await confirmCoAuthorInvitation(browser, Helpers.user3);

        // verify notification triggered after last confirmation
        await verifyLastEmailNotification(
            browser,
            Helpers.user1,
            'All co-authors have approved your Octopus publication'
        );

        // refresh corresponding author page
        await page.reload();

        // verify publish button is now enabled
        await page.waitForSelector(PageModel.publish.publishButton);
        await expect(page.locator(PageModel.publish.publishButton)).toBeEnabled();

        // publish the new publication
        page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);

        // check publication title and authors
        await expect(page.locator(`h1:has-text("${publicationWithCoAuthors.title}")`)).toBeVisible();
        await expect(page.getByText(Helpers.user1.shortName)).toBeVisible();
        await expect(page.getByText(Helpers.user2.shortName)).toBeVisible();
        await expect(page.getByText(Helpers.user3.shortName)).toBeVisible();
        await page.close();
    });

    test('Main author is notified via email when a co-author rejects invitation', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked publications')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // add one co-author
        await page.locator('aside button:has-text("Co-authors")').click();
        await addCoAuthor(page, Helpers.user2);

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();

        // co-author rejects invitation
        await rejectCoAuthorInvitation(browser, Helpers.user2);

        // verify main author is notified about the rejection
        await verifyLastEmailNotification(browser, Helpers.user1, 'A co-author has denied their involvement');

        await page.close();
    });

    test("Co Author is notified via email when they've been removed from a publication", async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked publications')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').click();
        await addCoAuthor(page, Helpers.user3);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user3.email}")`)).toBeVisible();

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        // verify notification sent to co-author
        await verifyLastEmailNotification(browser, Helpers.user3, 'You’ve been added as a co-author on Octopus');

        // remove co-author from the publication
        await removeCoAuthor(page, Helpers.user3);

        // verify co-author has been removed
        await expect(page.locator(`td:has-text("${Helpers.user3.email}")`)).not.toBeVisible();

        // save the publication
        await page.locator('button[title="Save"]').first().click();
        await page.locator('div[role="dialog"] button[title="Save"]').click();
        await page.waitForSelector('p:has-text("Publication successfully saved")');

        // verify notification sent to co-author
        await verifyLastEmailNotification(browser, Helpers.user3, 'You are no longer listed as a co-author');

        await page.close();
    });
});

test.describe('Publication Flow + File import', () => {
    test('Create PROBLEM publication where text is filled from document import', async ({ browser }) => {
        // Start up test
        const context = await browser.newContext();
        const page = await context.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        await createPublication(page, 'test publication - file import', 'PROBLEM');
        await publicationFlowKeyInformation(
            page,
            'CC_BY_NC',
            '01rv9gx86',
            'ror name',
            'ror city',
            'https://ror.com',
            'extra details'
        );
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // import initial playwright file
        await Helpers.openFileImportModal(page, './tests/LoggedIn/assets/Playwright.docx');
        await page.locator(PageModel.publish.insertButton).click();

        // Ensure modal has closed and file import
        await expect(page.locator(PageModel.publish.importModal)).not.toBeVisible();
        await expect(page.locator(PageModel.publish.text.editor)).toContainText('File Import – Playwright');

        // replace playwright file
        await Helpers.openFileImportModal(page, './tests/LoggedIn/assets/Playwright - Replace.docx');
        await page.locator(PageModel.publish.replaceButton).click();

        // Ensure modal has closed and file import
        await expect(page.locator(PageModel.publish.importModal)).not.toBeVisible();
        await expect(page.locator(PageModel.publish.text.editor)).toContainText('File Import – Playwright - Replaced');

        await page.click('button[title="Save"]:first-of-type');
        await Promise.all([
            page.click('div[role="dialog"] button[title="Save"]'),
            page.waitForResponse(
                (response) =>
                    response.url().includes('/publications') && response.request().method() === 'PATCH' && response.ok()
            )
        ]);

        await page.locator(PageModel.publish.nextButton).click();

        await publicationFlowConflictOfInterest(page, false);

        await publicationFlowFunders(
            page,
            '01rv9gx86',
            'funder name',
            'funder city',
            'https://funder.com',
            'extra details'
        );

        await page.locator(PageModel.publish.previewButton).click();
        await page.locator(PageModel.publish.publishButton).click();
        await page.locator(PageModel.publish.confirmPublishButton).click();

        await expect(page.getByText('File Import – Playwright')).toBeVisible();
    });
});
