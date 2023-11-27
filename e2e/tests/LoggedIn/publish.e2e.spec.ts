import * as Helpers from '../helpers';
import { expect, test, Page, Browser } from '@playwright/test';
import { PageModel } from '../PageModel';
import cuid2 from '@paralleldrive/cuid2';

export const createPublication = async (page: Page, publicationTitle: string, pubType: string) => {
    await page.goto(`${Helpers.UI_BASE}/create`);
    // title
    await page.locator(PageModel.publish.title).click();
    await page.keyboard.type(publicationTitle);
    // choose type
    await page.locator(PageModel.publish.publicationType).selectOption(pubType);
    // confirm
    await page.locator(PageModel.publish.confirmPublicationType).click();

    await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.createThisPublicationButton).click()]);
};

export const publicationFlowKeyInformation = async (page: Page) => {
    // Key Information
    // Change license
    // This is no longer a field - there is only one license we want people to use.
    // We may want to reintroduce it one day, so commenting out.
    // await page.locator(PageModel.publish.keyInformation.license).selectOption(licenseType);
    await page.locator(PageModel.publish.nextButton).click();
};

export const publicationFlowAffiliations = async (page: Page, isIndependentAuthor: boolean) => {
    if (isIndependentAuthor) {
        await page.click('#confirm-independent-author');
    } else {
        // add affiliations
        await page.locator('button[title="Add affiliation"]').nth(0).click();
    }

    await page.locator(PageModel.publish.nextButton).click();
};

export const publicationFlowLinkedPublication = async (
    page: Page,
    linkedPubSearchTerm: string,
    linkedPubTitle: string
) => {
    // Linked pub
    await page.locator(PageModel.publish.linkedItems.publicationInput).click();
    await page.keyboard.type(linkedPubSearchTerm);
    await page.locator(`[role="option"]:has-text("${linkedPubTitle}")`).click();
    await page.locator(PageModel.publish.linkedItems.addLink).click();
    await page.waitForResponse((response) => response.url().includes('/links?direct=true') && response.ok());
    await expect(page.locator(PageModel.publish.linkedItems.deletePublicationLink)).toBeVisible();

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

const deletePublication = async (page: Page) => {
    await page.locator(PageModel.publish.deletePublicationButton).click();
    await page.locator(PageModel.publish.confirmDeletePublicationButton).click();
};

export const publicationFlowConflictOfInterest = async (
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

interface PublicationTestType {
    pubType: string;
    language: string;
    title: string;
    author: string;
    text: string;
    references: Array<Reference>;
    coi: string;
    funding: string;
    fundingExtraDetails: string;
}

const problemPublication: PublicationTestType = {
    pubType: 'Research Problem',
    language: 'Afar',
    title: 'test title',
    author: Helpers.user1.fullName,
    text: 'main text',
    references: referencesList,
    coi: 'This Research Problem does not have any specified conflicts of interest.',
    funding: 'This Research Problem has the following sources of funding:',
    fundingExtraDetails: 'extra details'
};

const hypothesisPublication: PublicationTestType = {
    pubType: 'Rationale / Hypothesis',
    language: 'Afar',
    title: 'test title',
    author: Helpers.user1.fullName,
    text: 'main text',
    references: referencesList,
    coi: 'This Rationale / Hypothesis does not have any specified conflicts of interest.',
    funding: 'This Rationale / Hypothesis has the following sources of funding:',
    fundingExtraDetails: 'extra details'
};

const methodPublication: PublicationTestType = {
    pubType: 'Method',
    language: 'Afar',
    title: 'test title',
    author: Helpers.user1.fullName,
    text: 'main text',
    references: referencesList,
    coi: 'This Method does not have any specified conflicts of interest.',
    funding: 'This Method has the following sources of funding:',
    fundingExtraDetails: 'extra details'
};

const analysisPublication: PublicationTestType = {
    pubType: 'Analysis',
    language: 'Afar',
    title: 'test title',
    author: Helpers.user1.fullName,
    text: 'main text',
    references: referencesList,
    coi: 'This Analysis does not have any specified conflicts of interest.',
    funding: 'This Analysis has the following sources of funding:',
    fundingExtraDetails: 'extra details'
};

const interpretationPublication: PublicationTestType = {
    pubType: 'Interpretation',
    language: 'Afar',
    title: 'test title',
    author: Helpers.user1.fullName,
    text: 'main text',
    references: referencesList,
    coi: 'This Interpretation does not have any specified conflicts of interest.',
    funding: 'This Interpretation has the following sources of funding:',
    fundingExtraDetails: 'extra details'
};

const realWorldApplicationPublication: PublicationTestType = {
    pubType: 'Real World Application',
    language: 'Afar',
    title: 'test title',
    author: Helpers.user1.fullName,
    text: 'main text',
    references: referencesList,
    coi: 'This Real World Application does not have any specified conflicts of interest.',
    funding: 'This Real World Application has the following sources of funding:',
    fundingExtraDetails: 'extra details'
};

export const checkPublication = async (page: Page, publication: PublicationTestType, authors: Helpers.TestUser[]) => {
    // Wait for page to be loaded - viz will try to fetch links
    await page.waitForLoadState('networkidle');

    const publicationTemplate = (publication: PublicationTestType): string[] => [
        `aside span:has-text("${publication.pubType}")`,
        `aside span:has-text("${publication.language}")`,
        `h1:has-text("${publication.title}")`,
        `text=${publication.references[1].text}`,
        `text=${publication.references[1].refURL}`,
        `text=${publication.coi}`,
        `text=${publication.funding}`,
        `article p:has-text("${publication.fundingExtraDetails}")`,
        ...authors.map((author) => `main > section > header > div >> a:has-text("${author.shortName}")`)
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
        await publicationFlowKeyInformation(page);
        await publicationFlowAffiliations(page, false);
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
        await checkPublication(page, problemPublication, [Helpers.user1]);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.waitForLoadState('networkidle');
        await page.locator(PageModel.publish.publishButton).click();

        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, problemPublication, [Helpers.user1]);
    });

    test('Create a problem and link it to a topic', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        await createPublication(page, 'problem to link to topic', 'PROBLEM');
        // Go to Linked Items tab
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        // Link a topic and expect it to appear below with a delete button
        await page.locator(PageModel.publish.linkedItems.entityTypeSelect).selectOption('Research topics');
        await page.locator(PageModel.publish.linkedItems.topicInput).click();
        await page.keyboard.type('test');
        await page.locator(`[role="option"]:has-text("Test topic")`).click();
        await page.locator(PageModel.publish.linkedItems.addLink).click();
        await page.waitForResponse((response) => response.url().includes('/topics') && response.ok());
        await expect(page.locator(PageModel.publish.linkedItems.deleteTopicLink)).toBeVisible();
    });

    test('Cannot link a non-problem publication to a topic', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        await createPublication(page, 'hypothesis that should not be linkable to a topic', 'HYPOTHESIS');
        // Go to Linked Items tab
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        // Entity type select should not be visible
        await expect(page.locator(PageModel.publish.linkedItems.entityTypeSelect)).not.toBeVisible();
        // Publication combobox should be visible
        await expect(page.locator(PageModel.publish.linkedItems.publicationInput)).toBeVisible();
        // Topic combobox should not be visible
        await expect(page.locator(PageModel.publish.linkedItems.topicInput)).not.toBeVisible();
    });

    test('Create a problem from an existing research topic', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // Navigate to topic and create related problem
        await page.goto(`${Helpers.UI_BASE}/topics/test-topic-1`);
        await page.locator(PageModel.topic.createProblemLink).click();

        // Fill in basic fields
        await page.waitForURL(`${Helpers.UI_BASE}/create?topic=test-topic-1&type=PROBLEM`);
        await page.locator(PageModel.publish.title).click();
        await page.keyboard.type('Problem from topic');
        await page.locator(PageModel.publish.confirmPublicationType).click();

        // Save and expect topic to be associated in response
        await page.locator(PageModel.publish.createThisPublicationButton).click();
        const response = await page.waitForResponse(
            (response) => response.url().includes('/publications') && response.request().method() === 'POST'
        );

        const json = JSON.parse(await response.text());
        expect(json.versions[0].topics.length === 1);
        expect(json.versions[0].topics[0].title === 'Test topic');
    });

    test('Create a hypothesis (standard publication)', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        await createPublication(page, 'test title', 'HYPOTHESIS');
        await publicationFlowKeyInformation(page);
        await publicationFlowAffiliations(page, false);
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
        await checkPublication(page, hypothesisPublication, [Helpers.user1]);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, hypothesisPublication, [Helpers.user1]);
    });

    test('Create a method (standard publication)', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        await createPublication(page, 'test title', 'PROTOCOL');
        await publicationFlowKeyInformation(page);
        await publicationFlowAffiliations(page, false);
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
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, methodPublication, [Helpers.user1]);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, methodPublication, [Helpers.user1]);
    });

    test('Create an analysis (standard publication)', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        await createPublication(page, 'test title', 'ANALYSIS');
        await publicationFlowKeyInformation(page);
        await publicationFlowAffiliations(page, false);
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
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, analysisPublication, [Helpers.user1]);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();

        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, analysisPublication, [Helpers.user1]);
    });

    test('Create an interpretation (standard publication)', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        await createPublication(page, 'test title', 'INTERPRETATION');
        await publicationFlowKeyInformation(page);
        await publicationFlowAffiliations(page, true);
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
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, interpretationPublication, [Helpers.user1]);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, interpretationPublication, [Helpers.user1]);
    });

    test('Create a real world application (standard publication)', async ({ browser }) => {
        // Start up test
        const page = await browser.newPage();

        // Login
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        await createPublication(page, 'test title', 'REAL_WORLD_APPLICATION');
        await publicationFlowKeyInformation(page);
        await publicationFlowAffiliations(page, true);
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
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, realWorldApplicationPublication, [Helpers.user1]);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, realWorldApplicationPublication, [Helpers.user1]);
    });

    test('Corresponding author and co-authors can create multiple versions for a publication', async ({ browser }) => {
        let page = await browser.newPage();

        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create v1
        await createPublication(page, problemPublication.title, 'PROBLEM');
        await publicationFlowKeyInformation(page);
        await publicationFlowAffiliations(page, false);
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

        // publish v1
        await page.locator(PageModel.publish.publishButton).click();
        await page.locator(PageModel.publish.confirmPublishButton).click();

        await page.locator(`h1:has-text("${problemPublication.title}")`).first().waitFor({ state: 'visible' });

        await checkPublication(page, problemPublication, [Helpers.user1]);

        // get publication id from url and deduct canonical DOI
        const publicationId = page.url().split('/').slice(-3)[0];

        // create v2 and invite a co-author
        await page.locator('[data-testid="username-button"]').click();
        await page.locator('a:has-text("My Account")').click();
        await page.locator('h2:has-text("Live publications")').waitFor();

        // check latest live publication
        await page.locator(`a[href="/publications/${publicationId}"]`).waitFor();
        let livePublicationLocator = page.locator(`a[href="/publications/${publicationId}"]`);

        // check "Create new version" button is visible
        const createNewVersionButton = 'button:has-text("Create new version")';
        await expect(livePublicationLocator.locator(createNewVersionButton)).toBeVisible();

        // create new version
        await livePublicationLocator.locator(createNewVersionButton).click();
        await page.waitForResponse(
            (response) => response.request().method() === 'POST' && response.url().includes('/publication-versions')
        );

        // wait to be redirected to the edit page
        await page.waitForURL('**/edit?**');

        // change title
        let newTitle = problemPublication.title + ' v2';
        const titleInputLocator = 'input[aria-labelledby="title-label"]';
        await page.fill(titleInputLocator, newTitle);

        // invite a co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user2);

        // request approvals for v2
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.locator(`h1:has-text("${newTitle}")`).first().waitFor({ state: 'visible' });
        await page.locator(`h1:has-text("${newTitle}")`).waitFor(); // wait for redirect

        // confirm co-author invitation
        await confirmCoAuthorInvitation(browser, Helpers.user2);

        // publish v2
        await page.reload();
        await expect(page.locator(PageModel.publish.publishButtonTracker)).toBeEnabled();
        await page.locator(PageModel.publish.publishButtonTracker).click();
        await Promise.all([
            page.waitForNavigation(),
            page.locator(PageModel.publish.confirmPublishButtonTracker).click()
        ]);

        // check v2 is published
        await checkPublication(page, { ...problemPublication, title: newTitle }, [Helpers.user1, Helpers.user2]);

        // close corresponding author session
        await page.close();

        // create new session as co-author
        page = await browser.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser, Helpers.user2);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user2.fullName);

        // create v3 as co-author
        await page.locator('[data-testid="username-button"]').click();
        await page.locator('a:has-text("My Account")').click();
        await page.locator('h2:has-text("Live publications")').waitFor();

        // check latest live publication
        await expect(page.locator(`a[href="/publications/${publicationId}"]`)).toBeVisible();
        livePublicationLocator = page.locator(`a[href="/publications/${publicationId}"]`);

        // check "Create new version" button is visible
        await expect(livePublicationLocator.locator(createNewVersionButton)).toBeVisible();

        // create new version
        await livePublicationLocator.locator(createNewVersionButton).click();
        await page.waitForResponse(
            (response) => response.request().method() === 'POST' && response.url().includes('/publication-versions')
        );

        // wait to be redirected to the edit page
        await page.waitForURL('**/edit?**');

        // change title to v3
        newTitle = problemPublication.title + ' v3';
        await page.fill(titleInputLocator, newTitle);

        // remove initial corresponding author
        await removeCoAuthor(page, Helpers.user1);

        // preview the the new version
        await page.locator(PageModel.publish.previewButton).click();
        await page.locator(`h1:has-text("${newTitle}")`).first().waitFor({ state: 'visible' });

        // check v3 DRAFT
        await checkPublication(page, { ...problemPublication, title: newTitle }, [Helpers.user2]);
        await page.locator(PageModel.publish.versionsAccordionButton).waitFor();

        // switch between versions
        await page.click(PageModel.publish.versionsAccordionButton);
        await expect(page.locator('#versions-accordion p:has-text("Version 3: Currently viewed")')).toBeVisible();
        expect(page.url()).toContain('/versions/latest');

        // switch to v2
        await page.locator('#versions-accordion a').first().click();
        await page.waitForURL('**/versions/2');
        await expect(page.locator('#versions-accordion a:has-text("Version 3: Draft")')).toBeVisible();
        await expect(page.locator('#versions-accordion p:has-text("Version 2: Currently viewed")')).toBeVisible();

        // switch to v1
        await page.locator('#versions-accordion a').nth(1).click();
        await page.waitForURL('**/versions/1');
        await expect(page.locator('#versions-accordion a:has-text("Version 3: Draft")')).toBeVisible();
        await expect(page.locator('#versions-accordion p:has-text("Version 1: Currently viewed")')).toBeVisible();

        // switch back to v3
        await page.locator('#versions-accordion a').first().click();
        await page.waitForURL('**/versions/3');

        // go back to edit page
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.waitForURL('**/edit?**');

        // check publish button is now enabled
        await expect(page.locator(PageModel.publish.publishButton)).toBeEnabled();

        // publish v3
        await page.locator(PageModel.publish.publishButton).click();
        await page.locator(PageModel.publish.confirmPublishButton).click();
        await page.locator(`h1:has-text("${newTitle}")`).first().waitFor({ state: 'visible' });

        // check v3 is published
        await checkPublication(page, { ...problemPublication, title: newTitle }, [Helpers.user2]);
    });
});

const publicationWithCoAuthors = {
    title: 'Test co-authors',
    uniqueTitle: 'Test co-author - ' + cuid2.createId(),
    content: 'Testing co-authors',
    coAuthors: [Helpers.user2, Helpers.user3],
    type: 'PROBLEM'
};

const addCoAuthor = async (page: Page, user: Helpers.TestUser) => {
    await page.fill('input[type="email"]', user.email);
    await page.keyboard.press('Enter');
};

const removeCoAuthor = async (page: Page, user: Helpers.TestUser) => {
    await page.locator('aside button:has-text("Co-authors")').first().click();
    const row = page.locator('tr', { hasText: user.email });
    await row.locator('button[title="Delete"]').click();
};

const confirmCoAuthorInvitation = async (browser: Browser, user: Helpers.TestUser, hasAffiliations?: boolean) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(Helpers.UI_BASE);
    await Helpers.login(page, browser, user);
    const page2 = await context.newPage();
    await page2.goto(Helpers.MAIL_HOG);
    await page2.waitForSelector('.messages > .row');

    // click latest invitation link which was sent to this user and has text: "You’ve been added as a co-author on Octopus"
    await page2
        .locator(`.msglist-message:has-text("${user.email}")`, {
            hasText: 'You’ve been added as a co-author on Octopus'
        })
        .first()
        .click();

    // clicking 'Confirm & Review Publication' link is blocked by cors
    const invitationLink = await page2
        .frameLocator('iframe')
        .locator("a:has-text('Confirm & Review Publication')")
        .getAttribute('href');

    // navigate to that link instead
    const page3 = await context.newPage();
    await page3.goto(invitationLink);

    // confirm affiliations
    await page3.locator('a[title="Select your affiliations"]').first().click();

    if (hasAffiliations) {
        await page3.locator('button[title="Add affiliation"]').first().click();
    } else {
        await page3.locator('#confirm-independent-author').click();
    }
    await page3.locator('button:has-text("Confirm Affiliations")').click();

    // approve
    await (await page3.waitForSelector('button:has-text("approve")')).click();

    await (await page3.waitForSelector('button[title="Yes, this is ready to publish"]')).click();

    await page3.waitForSelector('button[title="Cancel your approval"]');
    await context.close();
};

const rejectCoAuthorInvitation = async (
    browser: Browser,
    user: Helpers.TestUser,
    checkErrorMessage: boolean = false,
    errorMessage?: string
) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(Helpers.UI_BASE);
    await Helpers.login(page, browser, user);
    const page2 = await context.newPage();
    await page2.goto(Helpers.MAIL_HOG);
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
        .locator("a:has-text('I am not an author')")
        .getAttribute('href');

    // navigating to 'I am not an author link' will remove this co-author from the publication
    const page3 = await context.newPage();
    await page3.goto(invitationLink);
    await page3.waitForLoadState('networkidle');

    if (checkErrorMessage) {
        await expect(page3.locator(`h2.error-message-e2e`)).toHaveText(errorMessage);
    }

    await context.close();
};

const verifyLastEmailNotification = async (browser: Browser, user: Helpers.TestUser, emailSubject: string) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(Helpers.MAIL_HOG);
    // verify last notification sent to this email
    await expect(page.locator(`.msglist-message:has-text("${user.email}")`).first()).toContainText(emailSubject);
    await context.close();
};

export const verifyPublicationIsDisplayedAsDraftForCoAuthor = async (
    browser: Browser,
    user: Helpers.TestUser,
    publicationTitle: string
) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(Helpers.UI_BASE);
    await Helpers.login(page, browser, user);

    await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${Helpers.user2.fullName}`);

    await page.locator(PageModel.header.usernameButton).click();
    await page.locator(PageModel.header.myProfileButton).click();

    await expect(page.locator(PageModel.myProfile.draftPublicationHeader)).toHaveText('Draft publications');

    // Confirm publication states: Ready to publish
    await expect(page.locator(`a:has-text("${publicationTitle}")`)).toContainText('Ready to publish');

    // // Confirm publication is showed as draft
    await page.locator(`a:has-text("${publicationTitle}")`).click();
    await expect(page.locator('button[title="Cancel your approval"]')).toBeVisible();
    await expect(page.locator(`h1:has-text("${publicationTitle}")`)).toHaveText(publicationTitle);

    await context.close();
};

export const verifyPublicationIsDisplayedAsLiveForCoAuthor = async (
    browser: Browser,
    user: Helpers.TestUser,
    publicationTitle: string
) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(Helpers.UI_BASE);
    await Helpers.login(page, browser, user);

    await expect(page.locator(PageModel.header.usernameButton)).toHaveText(`${Helpers.user2.fullName}`);

    await page.locator(PageModel.header.usernameButton).click();
    await page.locator(PageModel.header.myProfileButton).click();

    // Confirm publication is showed as live
    await page.locator(`a:has-text("${publicationTitle}")`).click();
    await expect(page.locator('button[title="Cancel your approval"]')).not.toBeVisible();
    await expect(page.locator(`h1:has-text("${publicationTitle}")`)).toHaveText(publicationTitle);

    await context.close();
};

export const unlockPublication = async (page: Page) => {
    await page.locator(PageModel.publish.unlockButton).click();
    await page.locator(PageModel.publish.confirmUnlockButton).click();
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

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliation tab
        await publicationFlowAffiliations(page, true);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // specify conflict of interest status
        await (await page.waitForSelector("aside button:has-text('Conflict of interest')")).click();
        await publicationFlowConflictOfInterest(page, false);

        // verify 'Publish' button is disabled
        await expect(page.locator(PageModel.publish.publishButton)).toBeDisabled();

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // verify 'Publish' button is now enabled
        await expect(page.locator(PageModel.publish.publishButton)).toBeEnabled();

        // add new line and white space in the Main Text
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.press('Enter');
        await page.keyboard.press('Space');

        // verify 'Publish' button is still enabled
        await expect(page.locator(PageModel.publish.publishButton)).toBeEnabled();

        // add co-authors
        await page.locator('aside button:has-text("Co-authors")').first().click();
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
        await confirmCoAuthorInvitation(browser, Helpers.user3, true);

        // verify notification triggered after last confirmation
        await verifyLastEmailNotification(
            browser,
            Helpers.user1,
            'All co-authors have approved your Octopus publication'
        );

        // refresh corresponding author page
        await page.reload();

        // verify publish button is now enabled
        await page.waitForSelector(PageModel.publish.publishButtonTracker);
        await expect(page.locator(PageModel.publish.publishButtonTracker)).toBeEnabled();

        // publish the new publication
        await page.locator(PageModel.publish.publishButtonTracker).click();
        await Promise.all([
            page.waitForNavigation(),
            page.locator(PageModel.publish.confirmPublishButtonTracker).click()
        ]);

        // check publication title and authors
        await expect(page.locator(`h1:has-text("${publicationWithCoAuthors.title}")`)).toBeVisible();
        await expect(page.locator(`span.author-name:has-text("${Helpers.user1.shortName}")`)).toBeVisible();
        await expect(page.locator(`span.author-name:has-text("${Helpers.user2.shortName}")`)).toBeVisible();
        await expect(page.locator(`span.author-name:has-text("${Helpers.user3.shortName}")`)).toBeVisible();
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

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, false);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, true, 'Some conflict of interest text');

        // add one co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
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

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, false);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, true, 'Some conflict of interest text');

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
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

        // Unlock publication
        await unlockPublication(page);

        // remove co-author from the publication
        await removeCoAuthor(page, Helpers.user3);

        // verify co-author has been removed
        await expect(page.locator(`td:has-text("${Helpers.user3.email}")`)).not.toBeVisible();

        // save the publication
        await page.locator('button[title="Save"]').first().click();
        await page.locator('div[role="dialog"] button[aria-label="Save"]').click();
        await page.waitForSelector('p:has-text("Publication successfully saved")');

        // verify notification sent to co-author
        await verifyLastEmailNotification(browser, Helpers.user3, 'You are no longer listed as a co-author');

        await page.close();
    });

    test('Authors order can be changed', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, false);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, true, 'Some conflict of interest text');

        // add co-authors
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user2);

        // verify authors order into the table
        await expect(page.locator('table > tbody > tr').first()).toContainText(Helpers.user1.email);
        await expect(page.locator('table > tbody > tr').nth(1)).toContainText(Helpers.user2.email);

        // change the order of authors using the keyboard
        await page.locator('span[title="Drag to reorder authors"]').first().focus();
        await page.keyboard.press('Space'); // select first row
        await page.waitForTimeout(100);
        await page.keyboard.press('ArrowDown'); // move it down
        await page.waitForTimeout(100);
        await page.keyboard.press('Space'); // confirm position
        await page.waitForTimeout(100);

        // verify authors order again
        await expect(page.locator('table > tbody > tr').first()).toContainText(Helpers.user2.email);
        await expect(page.locator('table > tbody > tr').nth(1)).toContainText(Helpers.user1.email);

        // Request approval from co author
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();

        // handle co-author confirmation
        await confirmCoAuthorInvitation(browser, Helpers.user2);

        // reload the page to see co-author confirmation
        await page.reload();

        // publish
        await page.locator(PageModel.publish.publishButtonTracker).click();
        await Promise.all([
            page.waitForNavigation(),
            page.locator(PageModel.publish.confirmPublishButtonTracker).click()
        ]);

        // check publication title and authors
        await expect(page.locator(`h1:has-text("${publicationWithCoAuthors.title}")`)).toBeVisible();
        await expect(page.locator(`span.author-name:has-text("${Helpers.user1.shortName}")`)).toBeVisible();
        await expect(page.locator(`span.author-name:has-text("${Helpers.user2.shortName}")`)).toBeVisible();

        // check authors order on the publication page
        await expect(page.locator('.author-name').first()).toContainText(Helpers.user2.shortName);
        await expect(page.locator('.author-name').nth(1)).toContainText(Helpers.user1.shortName);

        await page.close();
    });

    test('Co Author shown publication does not exist when denying an invite from a deleted publication', async ({
        browser
    }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, false);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, true, 'Some conflict of interest text');

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user2);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user2.email}")`)).toBeVisible();

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        // verify notification sent to co-author
        await verifyLastEmailNotification(browser, Helpers.user2, 'You’ve been added as a co-author on Octopus');

        // Unlock publication
        await unlockPublication(page);

        // remove co-author from the publication
        await removeCoAuthor(page, Helpers.user2);

        // verify co-author has been removed
        await expect(page.locator(`td:has-text("${Helpers.user2.email}")`)).not.toBeVisible();

        // save the publication
        await page.locator('button[title="Save"]').first().click();
        await page.locator('div[role="dialog"] button[aria-label="Save"]').click();
        await page.waitForSelector('p:has-text("Publication successfully saved")');

        // verify notification sent to co-author
        await verifyLastEmailNotification(browser, Helpers.user2, 'You are no longer listed as a co-author');

        // delete publication
        await deletePublication(page);

        // reject co-author invite
        await rejectCoAuthorInvitation(browser, Helpers.user2, true, 'This publication version does not exist.');

        await page.close();
    });

    test('Co Author deny message informs them publication has gone live', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, false);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, true, 'Some conflict of interest text');

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user2);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user2.email}")`)).toBeVisible();

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        // verify notification sent to co-author
        await verifyLastEmailNotification(browser, Helpers.user2, 'You’ve been added as a co-author on Octopus');

        // Unlock publication
        await unlockPublication(page);

        // remove co-author from the publication
        await removeCoAuthor(page, Helpers.user2);

        // publish the new publication
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);

        await rejectCoAuthorInvitation(
            browser,
            Helpers.user2,
            true,
            'This publication version is LIVE and therefore cannot be edited.'
        );

        await page.close();
    });

    test('Co Author who is no longer listed is presented with the correct error message', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, false);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, true, 'Some conflict of interest text');

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user2);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user2.email}")`)).toBeVisible();

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        // verify notification sent to co-author
        await verifyLastEmailNotification(browser, Helpers.user2, 'You’ve been added as a co-author on Octopus');

        // Unlock publication
        await unlockPublication(page);

        // remove co-author from the publication
        await removeCoAuthor(page, Helpers.user2);

        // verify co-author has been removed
        await expect(page.locator(`td:has-text("${Helpers.user2.email}")`)).not.toBeVisible();

        // save the publication
        await page.locator('button[title="Save"]').first().click();
        await page.locator('div[role="dialog"] button[aria-label="Save"]').click();
        await page.waitForSelector('p:has-text("Publication successfully saved")');

        // reject co-author invite
        await rejectCoAuthorInvitation(
            browser,
            Helpers.user2,
            true,
            'You are not currently listed as an author on this draft'
        );

        await page.close();
    });

    test('Co Author who denys after accepting the invite is presented with the correct error message', async ({
        browser
    }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, false);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, false);

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user2);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user2.email}")`)).toBeVisible();

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        // verify notification sent to co-author
        await verifyLastEmailNotification(browser, Helpers.user2, 'You’ve been added as a co-author on Octopus');

        await confirmCoAuthorInvitation(browser, Helpers.user2);

        // reject co-author invite
        await rejectCoAuthorInvitation(
            browser,
            Helpers.user2,
            true,
            'You have previously verified your involvement. Please contact the submitting author to be removed from this publication.'
        );

        await page.close();
    });

    test('Coauthored publications show on your own profile with correct publication status', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        const publicationTitle = publicationWithCoAuthors.uniqueTitle;
        await createPublication(page, publicationTitle, publicationWithCoAuthors.type);

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, false);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, false);

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user2);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user2.email}")`)).toBeVisible();

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        await confirmCoAuthorInvitation(browser, Helpers.user2);

        // verify the publication is displayed as draft on co-author profile
        await verifyPublicationIsDisplayedAsDraftForCoAuthor(browser, Helpers.user2, publicationTitle);

        // refresh corresponding author page
        await page.reload();

        // verify the status is set to 'ready to publish' for this publication
        await page.locator(PageModel.header.usernameButton).click();
        await page.locator(PageModel.header.myProfileButton).click();
        await expect(page.locator(`a:has-text("${publicationTitle}")`)).toContainText('Ready to publish');

        // go back to publication
        await page.locator(`a:has-text("${publicationTitle}")`).click();

        // publish the new publication
        await page.locator(PageModel.publish.publishButtonTracker).click();
        await Promise.all([
            page.waitForNavigation(),
            page.locator(PageModel.publish.confirmPublishButtonTracker).click()
        ]);

        // verify publication is displayed as live on co-author profile
        await verifyPublicationIsDisplayedAsLiveForCoAuthor(browser, Helpers.user2, publicationTitle);

        await page.close();
    });

    test('Co Authors appear properly in the Approvals Tracker', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, false);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, false);

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user2);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user2.email}")`)).toBeVisible();

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user3);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user3.email}")`)).toBeVisible();

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        await confirmCoAuthorInvitation(browser, Helpers.user2);
        await confirmCoAuthorInvitation(browser, Helpers.user3, true);

        // refresh corresponding author page
        await page.reload();

        await expect(page.getByText(Helpers.user2.fullName)).toBeVisible();
        await expect(page.getByText(Helpers.user2.email)).toBeVisible();
        await expect(page.getByText(Helpers.user3.fullName)).toBeVisible();
        await expect(page.getByText(Helpers.user3.email)).toBeVisible();
        await expect(page.getByText('All authors have approved this publication').first()).toBeVisible();
        await expect(page.getByText('Your role on this publication: Corresponding author')).toBeVisible();
        await expect(page.getByText(`${Helpers.user1.fullName} (You)`)).toBeVisible();

        await page.close();
    });

    test('Corresponding author can publish from Approvals Tracker', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, false);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, false);

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user2);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user2.email}")`)).toBeVisible();

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user3);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user3.email}")`)).toBeVisible();

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        // check preview page
        await expect(page.getByText('This publication is locked for approval')).toBeVisible();
        await expect(page.locator('table[data-testid="approval-tracker-table"]')).toBeVisible();
        await expect(page.getByText(`${Helpers.user1.fullName} (You)`)).toBeVisible();
        await expect(page.getByText('2 more author approvals are required before publishing')).toBeVisible();

        // handle co-authors confirmations
        await confirmCoAuthorInvitation(browser, Helpers.user2);
        await confirmCoAuthorInvitation(browser, Helpers.user3, true);

        // refresh corresponding author page
        await page.reload();
        await expect(page.getByText(Helpers.user2.fullName)).toBeVisible();
        await expect(page.getByText(Helpers.user3.fullName)).toBeVisible();

        await expect(page.getByText('All authors have approved this publication').first()).toBeVisible();
        await expect(page.getByText('Your role on this publication: Corresponding author')).toBeVisible();

        // publish
        await page.locator(PageModel.publish.publishButtonTracker).click();
        await Promise.all([
            page.waitForNavigation(),
            page.locator(PageModel.publish.confirmPublishButtonTracker).click()
        ]);

        // check draft publication controls are not available anymore
        await expect(page.getByText('This publication is locked for approval')).not.toBeVisible();
        await expect(page.locator('table[data-testid="approval-tracker-table"]')).not.toBeVisible();

        await page.close();
    });

    test("Corresponding author can change unconfirmed author's email from Approvals Tracker table", async ({
        browser
    }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, false);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, false);

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user2);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user2.email}")`)).toBeVisible();

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        // check preview page
        await expect(page.getByText('This publication is locked for approval')).toBeVisible();
        await expect(page.getByText('Your role on this publication: Corresponding author')).toBeVisible();
        await expect(page.locator('table[data-testid="approval-tracker-table"]')).toBeVisible();
        await expect(page.getByText(`${Helpers.user1.fullName} (You)`)).toBeVisible();
        await expect(page.getByText('1 more author approval is required before publishing')).toBeVisible();

        // check invited author is visible
        await expect(page.getByText(Helpers.user2.email)).toBeVisible();
        await expect(page.locator(`table button[title="Edit email for ${Helpers.user2.email}"]`)).toBeVisible();

        // change author's email
        await page.locator(`table button[title="Edit email for ${Helpers.user2.email}"]`).click();
        await page.locator('input[name="authorEmail"]').click();
        await page.fill('input[name="authorEmail"]', '');
        await page.fill('input[name="authorEmail"]', Helpers.user3.email);

        // confirm email change
        await page.locator('button[title="Change Email"]').click();
        await expect(page.getByText("Are you sure you want to change this author's email?")).toBeVisible();
        await page.locator('button[title="Yes, change email"]').click();
        await expect(page.getByText(Helpers.user3.email)).toBeVisible();

        await page.close();
    });

    test('Corresponding author can send reminders', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, false);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, false);

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user2);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user2.email}")`)).toBeVisible();

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        // check preview page
        await expect(page.getByText('This publication is locked for approval')).toBeVisible();
        await expect(page.getByText('Your role on this publication: Corresponding author')).toBeVisible();
        await expect(page.locator('table[data-testid="approval-tracker-table"]')).toBeVisible();
        await expect(page.getByText(`${Helpers.user1.fullName} (You)`)).toBeVisible();
        await expect(page.getByText('1 more author approval is required before publishing')).toBeVisible();

        // check invited author is visible
        await expect(page.getByText(Helpers.user2.email)).toBeVisible();

        // re-send invitation to 'Unconfirmed Author'
        await expect(page.getByText('Unconfirmed Author')).toBeVisible();
        await page.locator(`table button[title="Resend email to ${Helpers.user2.email}"]`).click();
        await expect(page.locator('h3', { hasText: 'Re-Send author invite' })).toBeVisible();
        await page.locator('button[title="Confirm"]').click();

        // check status
        await expect(page.locator(`table button[title="Resend email to ${Helpers.user2.email}"]`)).not.toBeVisible();
        await expect(page.getByText('Reminder sent at')).toBeVisible();

        // check email
        await page.goto(Helpers.MAIL_HOG);
        await page
            .locator(`.msglist-message:has-text("${Helpers.user2.email}")`, {
                hasText: 'You’ve been added as a co-author on Octopus'
            })
            .first()
            .click();

        await expect(
            page.frameLocator('iframe').getByText(`${Helpers.user1.fullName} has sent you a reminder`)
        ).toBeVisible();

        await page.close();
    });

    test('Editing a publication removes existing approvals', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, false);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, false);

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user2);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user2.email}")`)).toBeVisible();

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        await confirmCoAuthorInvitation(browser, Helpers.user2);

        await page.reload();
        await expect(page.getByText('All authors have approved this publication').first()).toBeVisible();

        await unlockPublication(page);

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        await expect(page.getByText('Approval Pending')).toBeVisible();

        await page.close();
    });

    test('Co-authors are notified if the publication was edited after they confirmed their involvement', async ({
        browser
    }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, false);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, false);

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user2);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user2.email}")`)).toBeVisible();

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        await confirmCoAuthorInvitation(browser, Helpers.user2);

        // unlock and request approvals again
        await unlockPublication(page);
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        await verifyLastEmailNotification(
            browser,
            Helpers.user2,
            'Changes have been made to a publication that you are an author on'
        );

        await page.close();
    });

    test('Co Authors can edit their affiliations using Approvals Tracker table', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);

        // create new publication
        await createPublication(page, publicationWithCoAuthors.title, publicationWithCoAuthors.type);

        // fill 'Key information' tab
        await publicationFlowKeyInformation(page);

        // fill affiliations tab
        await publicationFlowAffiliations(page, true);

        // add linked publication
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // add main text
        await (await page.waitForSelector("aside button:has-text('Main text')")).click();
        await page.locator(PageModel.publish.text.editor).click();
        await page.keyboard.type(publicationWithCoAuthors.content);

        // confirm conflict of interest
        await publicationFlowConflictOfInterest(page, false);

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user2);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user2.email}")`)).toBeVisible();

        // add co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.user3);

        // verify co-author has been added
        await expect(page.locator(`td:has-text("${Helpers.user3.email}")`)).toBeVisible();

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await page.locator(PageModel.publish.requestApprovalButton).click();
        await page.locator(PageModel.publish.confirmRequestApproval).click();
        await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());

        await expect(page.getByText('Unaffiliated').first()).toBeVisible();
        await expect(page.locator('button[title="Edit your affiliations"]')).toBeVisible();
        await page.locator('button[title="Edit your affiliations"]').click();

        await page.waitForSelector('input#confirm-independent-author[type="checkbox"]');
        await expect(page.getByText('No affiliations have been added')).toBeVisible();
        await expect(
            page.getByText('I am an independent author and do not need to enter any affiliations')
        ).toBeVisible();

        await expect(page.locator('button[title="Add affiliation"]').first()).toBeDisabled();
        await expect(page.locator('button[title="Remove affiliation"]')).not.toBeVisible();

        // uncheck 'I am an independent author and do not need to enter any affiliations' checkbox
        await page.click('label:has-text("I am an independent author and do not need to enter any affiliations")');

        // check 'Confirm Affiliations' button is now disabled because user didn't select any affiliations yet
        await expect(page.locator('button[title="Confirm Affiliations"]')).toBeDisabled();

        // check user can now select affiliations
        await expect(page.locator('button[title="Add affiliation"]').first()).toBeEnabled();

        // get first item title in the available affiliations list
        const firstAvailableAffiliationTitle = await page
            .locator('ul#available-affiliations-list > li')
            .first()
            .locator('h4')
            .first()
            .innerText();

        // get available affiliations count
        const availableAffiliationsCount = await page.locator('ul#available-affiliations-list > li').count();

        await page.locator('button[title="Add affiliation"]').first().click();

        await expect(page.locator('button[title="Remove affiliation"]')).toBeVisible();

        // get first item title in the selected affiliations list
        const firstSelectedAffiliationTitle = await page
            .locator('ul#selected-affiliations-list > li')
            .first()
            .locator('h4')
            .first()
            .innerText();

        // check that affiliation has been selected
        expect(firstAvailableAffiliationTitle).toEqual(firstSelectedAffiliationTitle);

        // check that selected affiliation is removed from the available affiliations list
        expect(
            await page.locator('ul#available-affiliations-list > li').first().locator('h4').first().innerText()
        ).not.toEqual(firstSelectedAffiliationTitle);

        const newAvailableAffiliationsCount = await page.locator('ul#available-affiliations-list > li').count();

        expect(newAvailableAffiliationsCount).toBeLessThan(availableAffiliationsCount);

        // check 'Confirm Affiliations' button is now enabled
        await expect(page.locator('button[title="Confirm Affiliations"]')).toBeEnabled();

        // confirm selected affiliations
        await page.locator('button[title="Confirm Affiliations"]').click();

        await Promise.all([
            page.waitForResponse(
                (response) =>
                    response.url().includes('/my-affiliations') &&
                    response.request().method() === 'PUT' &&
                    response.ok()
            ),
            page.waitForResponse(
                (response) =>
                    response.request().method() === 'GET' &&
                    response.url().includes(`/publication-versions`) &&
                    response.ok()
            )
        ]);

        // check approval's tracker table first row includes the selected affiliation title
        await expect(
            page
                .locator('table[data-testid="approval-tracker-table"] > tbody > tr')
                .first()
                .locator('td')
                .filter({ hasText: firstSelectedAffiliationTitle.split(':')[0] })
        ).toBeVisible();

        await page.close();
    });
});

test.describe('Publication Flow + File import', () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();
        await page.goto(Helpers.UI_BASE);
        await Helpers.login(page, browser);
    });

    test.afterAll(async () => {
        page.close();
    });

    test('Create PROBLEM publication where text is filled from document import', async () => {
        await expect(page.locator(PageModel.header.usernameButton)).toHaveText(Helpers.user1.fullName);
        await createPublication(page, 'test publication - file import', 'PROBLEM');
        await publicationFlowKeyInformation(page);
        await publicationFlowAffiliations(page, false);
        await publicationFlowLinkedPublication(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // import initial playwright file
        await Helpers.openFileImportModal(page, 'assets/Playwright.docx');
        await page.locator(PageModel.publish.insertButton).click();

        // Ensure modal has closed and file import
        await expect(page.locator(PageModel.publish.importModal)).not.toBeVisible();
        await expect(page.locator(PageModel.publish.text.editor)).toContainText('File Import – Playwright');

        // replace playwright file
        await Helpers.openFileImportModal(page, 'assets/Playwright - Replace.docx');
        await page.locator(PageModel.publish.replaceButton).click();

        // Ensure modal has closed and file import
        await expect(page.locator(PageModel.publish.importModal)).not.toBeVisible();
        await expect(page.locator(PageModel.publish.text.editor)).toContainText('File Import – Playwright - Replaced');

        await page.click('button[title="Save"]:first-of-type');
        await Promise.all([
            page.click('div[role="dialog"] button[aria-label="Save"]'),
            page.waitForResponse(
                (response) =>
                    response.url().includes('/publication-versions') &&
                    response.request().method() === 'PATCH' &&
                    response.ok()
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

        await page.locator(PageModel.publish.publishButton).click();
        await page.locator(PageModel.publish.confirmPublishButton).click();

        await expect(page.getByText('File Import – Playwright')).toBeVisible();
    });

    test('Upload images to "Main text" only allows specific formats: png, jpg, jpeg, apng, avif, gif, webp', async () => {
        await createPublication(page, 'test publication - image upload', 'PROBLEM');
        await page.waitForSelector('button:has-text("Main text")');
        await page.click('button:has-text("Main text")');

        const uploadImageButton = page.locator('button[title="Image"]');
        await expect(uploadImageButton).toBeVisible();
        await uploadImageButton.click();

        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'),
            page.click('label[for="file-upload"]')
        ]);

        const validImageFiles = [
            'assets/apng-image-test.png',
            'assets/avif-image-test.avif',
            'assets/gif-image-test.gif',
            'assets/jpeg-image-test.jpeg',
            'assets/jpg-image-test.jpg',
            'assets/webp-image-test.webp'
        ];

        // import correct file formats
        await fileChooser.setFiles(validImageFiles);

        // verify image previews
        await page.waitForSelector('img[alt="preview"]');
        await page.waitForTimeout(1000); // wait for images to load

        expect(await page.locator('img[alt="preview"]').count()).toEqual(6);

        // verify 'Upload images' button is now enabled
        await expect(page.locator('button[title="Upload image"]')).toBeEnabled();

        // upload images
        await page.click('button[title="Upload image"]');

        // verify images appear in the 'Main text'
        await expect(page.locator('button[title="Upload image"]')).not.toBeVisible();
        for (const image of validImageFiles) {
            await expect(
                page.locator(`div[contenteditable="true"] img[title="${image.split('assets/').pop()}"]`)
            ).toBeVisible();
        }

        // try do upload a wrong file format
        await uploadImageButton.click();
        const [fileChooser2] = await Promise.all([
            page.waitForEvent('filechooser'),
            page.click('label[for="file-upload"]')
        ]);
        await fileChooser2.setFiles(['assets/Playwright.docx']);
        await page.click('button[title="Upload image"]');
        await expect(page.getByText('Failed to upload "Playwright.docx". The format is not supported.')).toBeVisible();
    });
});
