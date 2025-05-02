import cuid2 from '@paralleldrive/cuid2';
import * as Helpers from '../helpers';
import { expect, test, Page, Browser } from '@playwright/test';
import { PageModel } from '../PageModel';
import path from 'path';

const deletePublication = async (page: Page) => {
    await page.locator(PageModel.publish.deletePublicationButton).click();
    await page.locator(PageModel.publish.confirmDeletePublicationButton).click();
};

const completeFundersTab = async (
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
    title: string;
    author: string;
    text: string;
    language?: string;
    references?: Array<Helpers.publicationCreation.Reference>;
    coi?: string;
    funding?: string;
    fundingExtraDetails?: string;
    selfDeclaration?: string;
    ethicalStatement?: string;
    ethicalApprover?: string;
    dataPermissionsStatement?: string;
    dataCollectionApprover?: string;
    dataAccessStatement?: string;
    additionalInformation?: Helpers.publicationCreation.AdditionalInformation;
}

const referencesList: Array<Helpers.publicationCreation.Reference> = [
    {
        text: 'Pighin S, Savadori L, Barilli E, Cremonesi L',
        refURL: '(doi:10.1177/0272989X11403490)'
    },
    {
        text: 'Reyna, V.F. and Brainerd, C.J., 2008. Numeracy',
        refURL: 'https://www.testrefurl1234.com'
    }
];

const sampleAdditionalInformation: Helpers.publicationCreation.AdditionalInformation = {
    title: 'My dataset',
    url: 'https://jisc.ac.uk/research/data/my-project/data.json',
    description: 'This dataset contains all the data that I collected as part of my project'
};

const problemPublication: PublicationTestType = {
    pubType: 'Research Problem',
    language: 'Afar',
    title: 'test title',
    author: Helpers.users.user1.fullName,
    text: 'main text',
    references: referencesList,
    coi: 'This Research Problem does not have any specified conflicts of interest.',
    funding: 'This Research Problem has the following sources of funding:',
    fundingExtraDetails: 'extra details',
    additionalInformation: sampleAdditionalInformation
};

const problemPublication2: PublicationTestType = {
    pubType: 'Research Problem 2',
    language: 'Afar',
    title: 'test title 2',
    author: Helpers.users.user1.fullName,
    text: 'main text',
    references: referencesList,
    coi: 'This Research Problem does not have any specified conflicts of interest.',
    funding: 'This Research Problem has the following sources of funding:',
    fundingExtraDetails: 'extra details'
};

const hypothesisPublication: PublicationTestType = {
    pubType: 'Rationale / Hypothesis',
    title: 'test title',
    author: Helpers.users.user1.fullName,
    text: 'main text',
    coi: 'details of conflict of interest',
    selfDeclaration: 'Data has not yet been collected to test this hypothesis (i.e. this is a preregistration)'
};

const methodPublication: PublicationTestType = {
    pubType: 'Method',
    title: 'test title',
    author: Helpers.users.user1.fullName,
    text: 'main text',
    selfDeclaration: 'Data has not yet been collected according to this method/protocol.'
};

const resultsPublication: PublicationTestType = {
    pubType: 'Results',
    title: 'test title',
    author: Helpers.users.user1.fullName,
    text: 'main text',
    ethicalStatement: 'The results in this publication involved human or animal subjects.',
    ethicalApprover: 'the appropriate body',
    dataPermissionsStatement: 'The results in this publication involved access to owned or copyrighted materials.',
    dataCollectionApprover: 'the copyright owner',
    dataAccessStatement: 'custom data access statement'
};

const analysisPublication: PublicationTestType = {
    pubType: 'Analysis',
    title: 'test title',
    author: Helpers.users.user1.fullName,
    text: 'main text'
};

const interpretationPublication: PublicationTestType = {
    pubType: 'Interpretation',
    title: 'test title',
    author: Helpers.users.user1.fullName,
    text: 'main text'
};

const realWorldApplicationPublication: PublicationTestType = {
    pubType: 'Real World Application',
    title: 'test title',
    author: Helpers.users.user1.fullName,
    text: 'main text'
};

const checkPublication = async (page: Page, publication: PublicationTestType, authors: Helpers.users.TestUser[]) => {
    // Wait for page to be loaded - viz will try to fetch links
    await page.waitForResponse((response) => response.url().includes('/links') && response.ok());

    const publicationTemplate = (publication: PublicationTestType): string[] => [
        `aside span:has-text("${publication.pubType}")`,
        `aside span:has-text("${publication.language ? publication.language : 'English'}")`,
        `h1:has-text("${publication.title}")`,
        ...authors.map((author) => `main > section > header > div >> a:has-text("${author.shortName}")`),
        ...(publication.references
            ? [`text="${publication.references[1].text}"`, `text="${publication.references[1].refURL}"`]
            : []),
        ...(publication.coi
            ? [`text="${publication.coi}"`]
            : [`text="This ${publication.pubType} does not have any specified conflicts of interest."`]),
        ...(publication.funding
            ? [`text="${publication.funding}"`]
            : [`text="No sources of funding have been specified for this ${publication.pubType}."`]),
        ...(publication.fundingExtraDetails ? [`article p:has-text("${publication.fundingExtraDetails}")`] : []),
        ...(publication.selfDeclaration ? [`text="${publication.selfDeclaration}"`] : []),
        ...(publication.ethicalStatement ? [`text="${publication.ethicalStatement}"`] : []),
        ...(publication.ethicalApprover ? [`text="${publication.ethicalApprover}"`] : []),
        ...(publication.dataPermissionsStatement ? [`text="${publication.dataPermissionsStatement}"`] : []),
        ...(publication.dataCollectionApprover ? [`text="${publication.dataCollectionApprover}"`] : []),
        ...(publication.dataAccessStatement ? [`text="${publication.dataAccessStatement}"`] : []),
        ...(publication.additionalInformation ? [`text="${publication.additionalInformation.title}"`] : [])
    ];

    await Promise.all(publicationTemplate(publication).map((selector) => expect(page.locator(selector)).toBeVisible()));
};

test.describe('Publication flow', () => {
    // Covers most of the publication fields:
    // - Key information: no action to test (previously licence but that was removed)
    // - Affiliations: independent author
    // - Linked items: linking a problem to a problem
    // - Main text:
    //      - Adding main text
    //      - Adding and deleting additional information
    //      - Changing language
    //      - Adding and deleting references
    //      - Adding description
    //      - Adding keywords
    // - Conflict of Interest: no conflict of interest
    // - Funders: Adding a funder by ROR ID and entering details manually
    test('Create a problem (standard publication)', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await Helpers.publicationCreation.createPublication(page, 'test title', 'PROBLEM');
        await Helpers.publicationCreation.completeKeyInformationTab(page);
        await Helpers.publicationCreation.completeAffiliationsTab(page, false);
        await Helpers.publicationCreation.completeLinkedItemsTab(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );
        await Helpers.publicationCreation.completeMainTextTab(
            page,
            'main text',
            sampleAdditionalInformation,
            'aa',
            referencesList,
            'description',
            'key, words'
        );
        await Helpers.publicationCreation.completeConflictOfInterestTab(page, false);
        await completeFundersTab(
            page,
            '01rv9gx86',
            'funder name',
            'funder city',
            'https://funder.com',
            'extra details'
        );

        // Preview and check preview draft publication
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, problemPublication, [Helpers.users.user1]);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.waitForLoadState('networkidle');
        await page.locator(PageModel.publish.publishButton).click();

        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, problemPublication, [Helpers.users.user1]);
    });

    // Covers common field interactions not covered by the "Create a problem" test:
    // - Affiliations: selecting an affiliation
    // - Linked items: linking a hypothesis to a problem
    // - Conlict of interest: conflict of interest is true and details supplied
    // Covers field interaction unique to hypotheses/methods:
    // - Research process: declare that this is a pre-registration
    test('Create a hypothesis (standard publication)', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await Helpers.publicationCreation.createPublication(page, 'test title', 'HYPOTHESIS');
        await Helpers.publicationCreation.completeKeyInformationTab(page);
        await Helpers.publicationCreation.completeAffiliationsTab(page, true);
        await Helpers.publicationCreation.completeLinkedItemsTab(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );
        await Helpers.publicationCreation.completeMainTextTabMinimally(page, 'main text');
        await Helpers.publicationCreation.completeConflictOfInterestTab(page, true, 'details of conflict of interest');

        // Add self declaration
        await (await page.waitForSelector("aside button:has-text('Research process')")).click();
        await page.locator(PageModel.publish.researchProcess.selfDeclaration).click();

        // Preview and check preview draft publication
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, hypothesisPublication, [Helpers.users.user1]);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, hypothesisPublication, [Helpers.users.user1]);
    });

    // Covers field interaction unique to hypotheses/methods:
    // - Research process: declare that this is a pre-registration
    // (should produce different text to hypotheses when publication is viewed)
    test('Create a method (standard publication)', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await Helpers.publicationCreation.createPublication(page, 'test title', 'PROTOCOL');
        await Helpers.publicationCreation.completeKeyInformationTab(page);
        await Helpers.publicationCreation.completeAffiliationsTab(page, false);
        await Helpers.publicationCreation.completeLinkedItemsTab(
            page,
            'a',
            'Hypothesis of Improving the quality of life for sustainable'
        );
        await Helpers.publicationCreation.completeMainTextTabMinimally(page, 'main text');
        await Helpers.publicationCreation.completeConflictOfInterestTab(page, false);

        // Add self declaration
        await (await page.waitForSelector("aside button:has-text('Research process')")).click();
        await page.locator(PageModel.publish.researchProcess.selfDeclaration).click();

        // Preview and check preview draft publication
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, methodPublication, [Helpers.users.user1]);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, methodPublication, [Helpers.users.user1]);
    });

    // Covers field interactions unique to results:
    // - Data statements: all fields
    test('Create results (standard publication)', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await Helpers.publicationCreation.createPublication(page, 'test title', 'DATA');
        await Helpers.publicationCreation.completeKeyInformationTab(page);
        await Helpers.publicationCreation.completeAffiliationsTab(page, false);
        await Helpers.publicationCreation.completeLinkedItemsTab(
            page,
            'a',
            'Protocol of Improving the quality of life for sustainable development'
        );
        await Helpers.publicationCreation.completeMainTextTabMinimally(page, 'main text');
        await Helpers.publicationCreation.completeConflictOfInterestTab(page, false);

        // Add data statements
        await (await page.waitForSelector("aside button:has-text('Data statements')")).click();
        await page.locator(PageModel.publish.dataStatements.ethicalStatementTrue).click();
        await page.locator(PageModel.publish.dataStatements.ethicalApprover).click();
        await page.keyboard.type(resultsPublication.ethicalApprover);
        await page.locator(PageModel.publish.dataStatements.dataPermissionsStatementTrue).click();
        await page.locator(PageModel.publish.dataStatements.dataCollectionApprover).click();
        await page.keyboard.type(resultsPublication.dataCollectionApprover);
        await page.locator(PageModel.publish.dataStatements.dataAccessStatementOther).click();
        await page.locator(PageModel.publish.dataStatements.dataAccessStatementFreeText).click();
        await page.keyboard.type(resultsPublication.dataAccessStatement);

        // Preview and check preview draft publication
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, resultsPublication, [Helpers.users.user1]);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, resultsPublication, [Helpers.users.user1]);
    });

    // Analyses have no unique fields. Just test that we can make one successfully.
    test('Create an analysis (standard publication)', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await Helpers.publicationCreation.createPublication(page, 'test title', 'ANALYSIS');
        await Helpers.publicationCreation.completeKeyInformationTab(page);
        await Helpers.publicationCreation.completeAffiliationsTab(page, false);
        await Helpers.publicationCreation.completeLinkedItemsTab(
            page,
            'a',
            'Data attached to Improving the quality of life for sustainable development'
        );
        await Helpers.publicationCreation.completeMainTextTabMinimally(page, 'main text');
        await Helpers.publicationCreation.completeConflictOfInterestTab(page, false);

        // Preview and check preview draft publication
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, analysisPublication, [Helpers.users.user1]);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();

        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, analysisPublication, [Helpers.users.user1]);
    });

    // Interpretations have no unique fields. Just test that we can make one successfully.
    test('Create an interpretation (standard publication)', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await Helpers.publicationCreation.createPublication(page, 'test title', 'INTERPRETATION');
        await Helpers.publicationCreation.completeKeyInformationTab(page);
        await Helpers.publicationCreation.completeAffiliationsTab(page, true);
        await Helpers.publicationCreation.completeLinkedItemsTab(
            page,
            'a',
            'Analysis of Improving the quality of life for sustainable'
        );
        await Helpers.publicationCreation.completeMainTextTabMinimally(page, 'main text');
        await Helpers.publicationCreation.completeConflictOfInterestTab(page, false);

        // Preview and check preview draft publication
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, interpretationPublication, [Helpers.users.user1]);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, interpretationPublication, [Helpers.users.user1]);
    });

    // Real world applications have no unique fields. Just test that we can make one successfully.
    test('Create a real world application (standard publication)', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await Helpers.publicationCreation.createPublication(page, 'test title', 'REAL_WORLD_APPLICATION');
        await Helpers.publicationCreation.completeKeyInformationTab(page);
        await Helpers.publicationCreation.completeAffiliationsTab(page, true);
        await Helpers.publicationCreation.completeLinkedItemsTab(
            page,
            'a',
            'Interpretation of Improving the quality of life for sustainable'
        );
        await Helpers.publicationCreation.completeMainTextTabMinimally(page, 'main text');
        await Helpers.publicationCreation.completeConflictOfInterestTab(page, false);

        // Preview and check preview draft publication
        await page.locator(PageModel.publish.previewButton).click();
        await checkPublication(page, realWorldApplicationPublication, [Helpers.users.user1]);

        // Publish and check live publication
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);
        await checkPublication(page, realWorldApplicationPublication, [Helpers.users.user1]);
    });

    test('Create a problem and link it to a topic', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await Helpers.publicationCreation.createPublication(page, 'problem to link to topic', 'PROBLEM');
        // Go to Linked Items tab
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        // Link a topic and expect it to appear below with a delete button
        await page.locator(PageModel.publish.linkedItems.entityTypeSelect).selectOption('Research topics');
        await page.locator(PageModel.publish.linkedItems.topicInput).click();
        await page.keyboard.type('Computer science');
        await page.locator(`[role="option"]:has-text("Computer science")`).click();
        await page.locator(PageModel.publish.linkedItems.addLink).click();
        await page.waitForResponse((response) => response.url().includes('/topics') && response.ok());
        await expect(page.locator(PageModel.publish.linkedItems.deleteTopicLink)).toBeVisible();
    });

    test('Cannot link a non-problem publication to a topic', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);
        await Helpers.publicationCreation.createPublication(
            page,
            'hypothesis that should not be linkable to a topic',
            'HYPOTHESIS'
        );
        // Go to Linked Items tab
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        // Topic option should not be visible
        const options = await page.getByRole('option').all();
        await expect(options.length).toBe(2);
        await expect(options[0]).toHaveAccessibleName('Publications');
        await expect(options[1]).toHaveAccessibleName('Drafts');
    });

    test('Create a problem from an existing research topic', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);

        // Navigate to topic and create related problem
        await page.goto(`/topics/cly468yyb00177ryzsvccai51`);
        await page.locator(PageModel.topic.createProblemLink).click();

        // Fill in basic fields
        await page.waitForURL(`/create?topic=cly468yyb00177ryzsvccai51&type=PROBLEM`);
        await page.locator(PageModel.publish.title).click();
        await page.keyboard.type('Problem from topic');
        await page.locator(PageModel.publish.confirmPublicationType).click();

        // Save and expect topic to be shown as a linked item
        await page.locator(PageModel.publish.createThisPublicationButton).click();
        await page.waitForResponse(
            (response) => response.url().includes('/publications') && response.request().method() === 'POST'
        );
        await (await page.waitForSelector("aside button:has-text('Linked items')")).click();
        await expect(page.locator(PageModel.publish.linkedItems.deleteTopicLink)).toBeVisible();
    });
});

const publicationWithCoAuthors = {
    title: 'Test co-authors',
    uniqueTitle: 'Test co-author - ' + cuid2.createId(),
    content: 'Testing co-authors',
    coAuthors: [Helpers.users.user2, Helpers.users.user3],
    type: 'PROBLEM'
};

const addCoAuthor = async (page: Page, user: Helpers.users.TestUser) => {
    await page.fill('input[type="email"]', user.email);
    await page.keyboard.press('Enter');
};

const removeCoAuthor = async (page: Page, user: Helpers.users.TestUser) => {
    await page.locator('aside button:has-text("Co-authors")').first().click();
    const row = page.locator('tr', { hasText: user.email });
    await row.locator('button[title="Delete"]').click();
};

const requestApproval = async (page: Page) => {
    await page.locator(PageModel.publish.requestApprovalButton).click();
    await page.locator(PageModel.publish.confirmRequestApproval).click();
    await page.waitForResponse((response) => response.url().includes('/request-approval') && response.ok());
    // Wait for new data to be fetched on the publication page.
    const publicationFieldsRegex = /\/publications\/[0-9a-zA-Z\-]+\?fields=/;
    await page.waitForResponse((response) => publicationFieldsRegex.test(response.url()) && response.ok());
};

const confirmInvolvement = async (browser: Browser, user: Helpers.users.TestUser, page: Page) => {
    const mailpitPage = await browser.newPage();
    await mailpitPage.goto(Helpers.constants.MAILPIT);
    await mailpitPage.waitForSelector('#message-page');
    await mailpitPage
        .locator(`.message:has-text("${user.email}")`, {
            hasText: 'You’ve been added as a co-author on Octopus'
        })
        .first()
        .click();

    // clicking 'Confirm & Review Publication' link is blocked by cors
    const invitationLink = await mailpitPage
        .frameLocator('iframe')
        .locator("a:has-text('Confirm & Review Publication')")
        .getAttribute('href');
    await mailpitPage.close();
    // navigate to that link instead
    await page.goto(invitationLink);
    await expect(page.locator('a[title="Select your affiliations"]')).toBeVisible();
};

const approvePublication = async (page: Page, hasAffiliations?: boolean) => {
    // confirm affiliations
    await page.locator('a[title="Select your affiliations"]').first().click();

    if (hasAffiliations) {
        await page.locator('button[title="Add affiliation"]').first().click();
    } else {
        await page.locator('#confirm-independent-author').click();
    }
    await page.locator('button:has-text("Confirm Affiliations")').click();

    // approve
    await (await page.waitForSelector('button:has-text("approve")')).click();

    await (await page.waitForSelector('button[title="Yes, this is ready to publish"]')).click();

    await page.waitForSelector('button[title="Cancel your approval"]');
};

const confirmCoAuthorInvitation = async (browser: Browser, user: Helpers.users.TestUser) => {
    const page = await Helpers.users.getPageAsUser(browser, user);
    await confirmInvolvement(browser, user, page);
    await approvePublication(page);
    await page.close();
};

const approveControlRequest = async (
    browser: Browser,
    user: Helpers.users.TestUser,
    requesterName: string,
    approve: boolean
) => {
    const page = await Helpers.users.getPageAsUser(browser, user);

    await page.goto(Helpers.constants.MAILPIT);
    await page.waitForSelector('#message-page');

    // click on the latest request for the given 'requesterName' that has been sent to this user
    await page
        .locator(`.message:has-text("${user.email}")`, {
            hasText: `${requesterName} is requesting to take over editing`
        })
        .first()
        .click();

    if (approve) {
        const approveRequestControlLink = await page
            .frameLocator('iframe')
            .locator(`a:has-text('Transfer control to ${requesterName}')`)
            .getAttribute('href');

        await page.goto(approveRequestControlLink);
        await page.waitForLoadState('networkidle');
    } else {
        const rejectRequestControlLink = await page
            .frameLocator('iframe')
            .locator(`a:has-text("Reject request")`)
            .getAttribute('href');
        await page.goto(rejectRequestControlLink);
        await page.waitForLoadState('networkidle');
    }

    await page.close();
};

const rejectCoAuthorInvitation = async (
    browser: Browser,
    user: Helpers.users.TestUser,
    checkErrorMessage: boolean = false,
    errorMessage?: string
) => {
    const page = await Helpers.users.getPageAsUser(browser, user);
    const page2 = await browser.newPage();
    await page2.goto(Helpers.constants.MAILPIT);
    await page2.waitForSelector('#message-page');

    // click latest invitation link which was sent to this user and has text: "You’ve been added as a co-author on Octopus"
    await page2
        .locator(`.message:has-text("${user.email}")`, {
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
    await page.goto(invitationLink);
    await page.waitForLoadState('networkidle');

    if (checkErrorMessage) {
        await expect(page.locator(`h2.error-message-e2e`)).toHaveText(errorMessage);
    }

    await Promise.all([page.close(), page2.close()]);
};

const verifyLastEmailNotification = async (browser: Browser, user: Helpers.users.TestUser, emailSubject: string) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(Helpers.constants.MAILPIT);
    // verify last notification sent to this email
    await expect(page.locator(`.message:has-text("${user.email}")`).first()).toContainText(emailSubject);
    await context.close();
};

const unlockPublication = async (page: Page) => {
    await page.locator(PageModel.publish.unlockButton).click();
    await page.locator(PageModel.publish.confirmUnlockButton).click();
    await page.waitForURL('**/edit?**');
};

type AccountPagePublicationState =
    | 'own first draft'
    | 'unconfirmed coauthor'
    | 'pending coauthor approval'
    | 'pending your approval'
    | 'approved'
    | 'published once'
    | 'published'
    | 'own new version'
    | "coauthor's new version"
    | "coauthor's unlocked draft";
const checkPublicationOnAccountPage = async (
    page: Page,
    publicationDetails: { id: string; title?: string; userShortName?: string },
    state: AccountPagePublicationState,
    navigate?: boolean
) => {
    if (navigate) {
        await page.waitForLoadState('networkidle');
        await page.goto(`/account`);
    }
    const publicationContainer = await page.getByTestId('publication-' + publicationDetails.id);
    switch (state) {
        case 'own first draft':
            await expect(publicationContainer).toContainText('Research Problem');
            await expect(publicationContainer).toContainText(publicationDetails.title);
            await expect(publicationContainer).toContainText('0 published versions');
            await expect(publicationContainer).toContainText('(Corresponding Author)');
            await expect(publicationContainer).toContainText('Status: Draft');
            await expect(publicationContainer.locator(PageModel.myAccount.editDraftButton)).toBeVisible();
            await expect(publicationContainer.locator(PageModel.myAccount.viewDraftButton)).not.toBeVisible();
            await expect(publicationContainer).toContainText('Never published');
            break;
        case 'pending coauthor approval':
            await expect(publicationContainer).toContainText('Status: Pending author approval');
            await expect(publicationContainer.locator(PageModel.myAccount.viewDraftButton)).toBeVisible();
            break;
        case 'unconfirmed coauthor':
            await expect(publicationContainer).toContainText('(Invited)');
            await expect(publicationContainer).toContainText('Status: Pending author approval');
            await expect(publicationContainer).toContainText(
                `${Helpers.users.user1.shortName} has created a new draft version. You will need to confirm your involvement to access it.`
            );
            await expect(publicationContainer.locator(PageModel.myAccount.confirmInvolvementButton)).toBeVisible();
            break;
        case 'pending your approval':
            await expect(publicationContainer).toContainText('(Author)');
            await expect(publicationContainer).toContainText('Status: Pending your approval');
            await expect(publicationContainer.locator(PageModel.myAccount.viewDraftButton)).toBeVisible();
            await expect(publicationContainer.locator(PageModel.myAccount.requestControlButton)).toBeVisible();
            break;
        case 'approved':
            await expect(publicationContainer).toContainText('Status: Ready to publish');
            await expect(publicationContainer.locator(PageModel.myAccount.viewDraftButton)).toBeVisible();
            break;
        case 'published once':
            await expect(publicationContainer).toContainText('1 published version');
            await expect(publicationContainer).toContainText('New draft not created');
            await expect(publicationContainer.locator(PageModel.myAccount.createDraftVersionButton)).toBeVisible();
            await expect(publicationContainer).toContainText('Published on ');
            break;
        case 'published':
            await expect(publicationContainer.locator(PageModel.myAccount.createDraftVersionButton)).toBeVisible();
            await expect(publicationContainer).toContainText('Published on ');
            await expect(publicationContainer.locator(PageModel.myAccount.viewButton)).toBeVisible();
            break;
        case 'own new version':
            await expect(publicationContainer).toContainText('(Corresponding Author)');
            break;
        case "coauthor's new version":
            await expect(publicationContainer).toContainText(
                'Someone else is working on a new draft version, and you do not yet have access to it'
            );
            await expect(publicationContainer.locator(PageModel.myAccount.requestControlButton)).toBeVisible();
            await expect(publicationContainer.locator(PageModel.myAccount.viewDraftButton)).not.toBeVisible();
            break;
        case "coauthor's unlocked draft":
            await expect(publicationContainer).toContainText('Status: Editing in progress');
            await expect(publicationContainer).toContainText(
                `${Helpers.users.user2.shortName} is working on a new draft version`
            );
            await expect(publicationContainer.locator(PageModel.myAccount.viewDraftButton)).toBeVisible();
            await expect(publicationContainer.locator(PageModel.myAccount.requestControlButton)).toBeVisible();
            break;
    }
};

const addCoAuthorsAndRequestApproval = async (page: Page, coAuthors: Helpers.users.TestUser[]) => {
    await page.locator('aside button:has-text("Co-authors")').first().click();
    for (const coAuthor of coAuthors) {
        await addCoAuthor(page, coAuthor);
        // verify co-author has been added
        await expect(page.locator(`td:has-text("${coAuthor.email}")`)).toBeVisible();
    }
    await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
    await requestApproval(page);
};

test.describe('Publication flow + co-authors', () => {
    test('Create a PROBLEM publication with co-authors', async ({ browser }) => {
        test.slow();
        const page = await Helpers.users.getPageAsUser(browser);

        // create new publication and fill in other required fields
        await Helpers.publicationCreation.createPublishReadyPublication(page, publicationWithCoAuthors.title);

        // verify 'Publish' button is now enabled
        await expect(page.locator(PageModel.publish.publishButton)).toBeEnabled();

        // add co-authors
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.users.user2);
        await addCoAuthor(page, Helpers.users.user3);

        // verify 'Publish' button is now request approval button
        const requestApprovalButton = page.locator(PageModel.publish.requestApprovalButton);
        await expect(requestApprovalButton).toBeEnabled();

        // Request approval from co authors
        await requestApproval(page);

        // first co-author confirmation
        await confirmCoAuthorInvitation(browser, Helpers.users.user2);

        // verify notification triggered after first confirmation
        await verifyLastEmailNotification(
            browser,
            Helpers.users.user1,
            'A co-author has approved your Octopus publication'
        );

        // second co-author confirmation
        await confirmCoAuthorInvitation(browser, Helpers.users.user3);

        // verify notification triggered after last confirmation
        await verifyLastEmailNotification(
            browser,
            Helpers.users.user1,
            'All co-authors have approved your Octopus publication'
        );

        // refresh corresponding author page
        await page.reload();

        // Check details in approval tracker
        await expect(page.getByText(Helpers.users.user2.fullName)).toBeVisible();
        await expect(page.getByText(Helpers.users.user2.email)).toBeVisible();
        await expect(page.getByText(Helpers.users.user3.fullName)).toBeVisible();
        await expect(page.getByText(Helpers.users.user3.email)).toBeVisible();
        await expect(page.getByText('All authors have approved this publication').first()).toBeVisible();
        await expect(page.getByText('Your role on this publication: Corresponding author')).toBeVisible();
        await expect(page.getByText(`${Helpers.users.user1.fullName} (You)`)).toBeVisible();

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
        await expect(page.locator(`span.author-name:has-text("${Helpers.users.user1.shortName}")`)).toBeVisible();
        await expect(page.locator(`span.author-name:has-text("${Helpers.users.user2.shortName}")`)).toBeVisible();
        await expect(page.locator(`span.author-name:has-text("${Helpers.users.user3.shortName}")`)).toBeVisible();
        await page.close();
    });

    test('Main author is notified via email when a co-author rejects invitation', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);

        await Helpers.publicationCreation.createPublishReadyPublication(page);
        await addCoAuthorsAndRequestApproval(page, [Helpers.users.user2]);

        // co-author rejects invitation
        await rejectCoAuthorInvitation(browser, Helpers.users.user2);

        // verify main author is notified about the rejection
        await verifyLastEmailNotification(browser, Helpers.users.user1, 'A co-author has denied their involvement');

        await page.close();
    });

    test("Co Author is notified via email when they've been removed from a publication", async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);

        await Helpers.publicationCreation.createPublishReadyPublication(page);
        await addCoAuthorsAndRequestApproval(page, [Helpers.users.user3]);

        // verify notification sent to co-author
        await verifyLastEmailNotification(browser, Helpers.users.user3, 'You’ve been added as a co-author on Octopus');

        // Unlock publication
        await unlockPublication(page);

        // remove co-author from the publication
        await removeCoAuthor(page, Helpers.users.user3);

        // verify co-author has been removed
        await expect(page.locator(`td:has-text("${Helpers.users.user3.email}")`)).not.toBeVisible();

        // save the publication
        await page.locator('button[title="Save"]').first().click();
        await page.locator('div[role="dialog"] button[aria-label="Save"]').click();
        await page.waitForSelector('p:has-text("Publication successfully saved")');

        // verify notification sent to co-author
        await verifyLastEmailNotification(browser, Helpers.users.user3, 'You are no longer listed as a co-author');

        await page.close();
    });

    test('Authors order can be changed', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);

        // create new publication
        await Helpers.publicationCreation.createPublishReadyPublication(page, publicationWithCoAuthors.title);

        // add co-authors
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.users.user2);

        // verify authors order in the table
        await expect(page.locator('table > tbody > tr').first()).toContainText(Helpers.users.user1.email);
        await expect(page.locator('table > tbody > tr').nth(1)).toContainText(Helpers.users.user2.email);

        // change the order of authors using the keyboard
        await page.locator('span[title="Drag to reorder authors"]').first().focus();
        await page.keyboard.press('Space'); // select first row
        await page.waitForTimeout(100);
        await page.keyboard.press('ArrowDown'); // move it down
        await page.waitForTimeout(100);
        await page.keyboard.press('Space'); // confirm position
        await page.waitForTimeout(100);

        // verify authors order again
        await expect(page.locator('table > tbody > tr').first()).toContainText(Helpers.users.user2.email);
        await expect(page.locator('table > tbody > tr').nth(1)).toContainText(Helpers.users.user1.email);

        // Request approval from co author
        await requestApproval(page);

        // handle co-author confirmation
        await confirmCoAuthorInvitation(browser, Helpers.users.user2);

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
        await expect(page.locator(`span.author-name:has-text("${Helpers.users.user1.shortName}")`)).toBeVisible();
        await expect(page.locator(`span.author-name:has-text("${Helpers.users.user2.shortName}")`)).toBeVisible();

        // check authors order on the publication page
        await expect(page.locator('.author-name').first()).toContainText(Helpers.users.user2.shortName);
        await expect(page.locator('.author-name').nth(1)).toContainText(Helpers.users.user1.shortName);

        await page.close();
    });

    test('Co Author shown publication does not exist when denying an invite from a deleted publication', async ({
        browser
    }) => {
        const page = await Helpers.users.getPageAsUser(browser);

        await Helpers.publicationCreation.createPublishReadyPublication(page);
        await addCoAuthorsAndRequestApproval(page, [Helpers.users.user2]);

        // Unlock publication
        await unlockPublication(page);

        // remove co-author from the publication
        await removeCoAuthor(page, Helpers.users.user2);

        // verify co-author has been removed
        await expect(page.locator(`td:has-text("${Helpers.users.user2.email}")`)).not.toBeVisible();

        // save the publication
        await page.locator('button[title="Save"]').first().click();
        await page.locator('div[role="dialog"] button[aria-label="Save"]').click();
        await page.waitForSelector('p:has-text("Publication successfully saved")');

        // verify notification sent to co-author
        await verifyLastEmailNotification(browser, Helpers.users.user2, 'You are no longer listed as a co-author');

        // delete publication
        await deletePublication(page);

        // reject co-author invite
        await rejectCoAuthorInvitation(browser, Helpers.users.user2, true, 'This publication version does not exist.');

        await page.close();
    });

    test('Co Author deny message informs them publication has gone live', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);

        await Helpers.publicationCreation.createPublishReadyPublication(page);
        await addCoAuthorsAndRequestApproval(page, [Helpers.users.user2]);

        // Unlock publication
        await unlockPublication(page);

        // remove co-author from the publication
        await removeCoAuthor(page, Helpers.users.user2);

        // publish the new publication
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator(PageModel.publish.confirmPublishButton).click()]);

        await rejectCoAuthorInvitation(
            browser,
            Helpers.users.user2,
            true,
            'This publication version is LIVE and therefore cannot be edited.'
        );

        await page.close();
    });

    test('Co Author who is no longer listed is presented with the correct error message', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);

        await Helpers.publicationCreation.createPublishReadyPublication(page);
        await addCoAuthorsAndRequestApproval(page, [Helpers.users.user2]);

        // Unlock publication
        await unlockPublication(page);

        // remove co-author from the publication
        await removeCoAuthor(page, Helpers.users.user2);

        // verify co-author has been removed
        await expect(page.locator(`td:has-text("${Helpers.users.user2.email}")`)).not.toBeVisible();

        // save the publication
        await page.locator('button[title="Save"]').first().click();
        await page.locator('div[role="dialog"] button[aria-label="Save"]').click();
        await page.waitForSelector('p:has-text("Publication successfully saved")');

        // reject co-author invite
        await rejectCoAuthorInvitation(
            browser,
            Helpers.users.user2,
            true,
            'You are not currently listed as an author on this draft'
        );

        await page.close();
    });

    test('Co Author who denies after accepting the invite is presented with the correct error message', async ({
        browser
    }) => {
        const page = await Helpers.users.getPageAsUser(browser);

        await Helpers.publicationCreation.createPublishReadyPublication(page);
        await addCoAuthorsAndRequestApproval(page, [Helpers.users.user2]);

        await confirmCoAuthorInvitation(browser, Helpers.users.user2);

        // reject co-author invite
        await rejectCoAuthorInvitation(
            browser,
            Helpers.users.user2,
            true,
            'You have previously verified your involvement. Please contact the submitting author to be removed from this publication.'
        );

        await page.close();
    });

    test('Coauthored publications show on your own profile with correct publication status', async ({ browser }) => {
        test.slow();
        const publicationTitle = 'account page check';
        const coAuthor = Helpers.users.user2;
        const page = await Helpers.users.getPageAsUser(browser);
        await Helpers.publicationCreation.createPublication(page, publicationTitle, 'PROBLEM');
        const publicationId = page.url().split('/').slice(-2)[0];
        const publicationContainerTestId = 'publication-' + publicationId;

        // Check draft details
        await checkPublicationOnAccountPage(
            page,
            { id: publicationId, title: publicationTitle },
            'own first draft',
            true
        );

        // Edit draft
        await page.getByTestId(publicationContainerTestId).locator(PageModel.myAccount.editDraftButton).click();
        await Helpers.publicationCreation.completeKeyInformationTab(page);
        await Helpers.publicationCreation.completeAffiliationsTab(page, true);
        await Helpers.publicationCreation.completeLinkedItemsTab(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );
        await Helpers.publicationCreation.completeMainTextTabMinimally(page, 'main text');
        await Helpers.publicationCreation.completeConflictOfInterestTab(page, false);
        // Add co-author and request approval
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, coAuthor);
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await requestApproval(page);

        // Check locked details
        await checkPublicationOnAccountPage(page, { id: publicationId }, 'pending coauthor approval', true);

        // Check details as unconfirmed co-author
        const page2 = await Helpers.users.getPageAsUser(browser, Helpers.users.user2);
        await checkPublicationOnAccountPage(page2, { id: publicationId }, 'unconfirmed coauthor', true);

        // As co-author, confirm involvement without approving
        await confirmInvolvement(browser, coAuthor, page2);

        // Check details as co-author
        await checkPublicationOnAccountPage(page2, { id: publicationId }, 'pending your approval', true);

        // Approve publication
        await page2.goto('/publications/' + publicationId);
        await approvePublication(page2);

        // Check details as co-author
        await checkPublicationOnAccountPage(page2, { id: publicationId }, 'approved', true);

        // Check details as corresponding author
        await page.reload();
        await checkPublicationOnAccountPage(page, { id: publicationId }, 'approved');

        // Publish
        await page.getByTestId(publicationContainerTestId).locator(PageModel.myAccount.viewDraftButton).click();
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([page.waitForNavigation(), page.locator('button[aria-label="Yes"]').click()]);

        // Check published details
        await checkPublicationOnAccountPage(page, { id: publicationId }, 'published once', true);

        // Create new version as co-author
        await page2.reload();
        await page2
            .getByTestId(publicationContainerTestId)
            .locator(PageModel.myAccount.createDraftVersionButton)
            .click();
        await page2.locator('button[title="Confirm"]').click();
        await page2.waitForResponse(
            (response) => response.request().method() === 'POST' && response.url().includes('/publication-versions')
        );
        await page2.waitForURL('**/edit?**');

        // Request approval on new version
        await expect(page2.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await requestApproval(page2);

        // Check details as co-author (new corresponding author)
        await checkPublicationOnAccountPage(page2, { id: publicationId }, 'own new version', true);

        // Confirm involvement on new version
        await confirmInvolvement(browser, Helpers.users.user1, page);

        // Unlock publication
        await page2.getByTestId(publicationContainerTestId).locator(PageModel.myAccount.viewDraftButton).click();
        await unlockPublication(page2);

        // Check details as old author
        await checkPublicationOnAccountPage(
            page,
            { id: publicationId, userShortName: Helpers.users.user2.shortName },
            "coauthor's unlocked draft",
            true
        );

        // Remove original author from coauthors and save
        await page2.locator('aside button:has-text("Co-authors")').first().click();
        await removeCoAuthor(page2, Helpers.users.user1);
        await page2.locator('button[title="Save"]').first().click();
        await page2.locator('div[role="dialog"] button[aria-label="Save"]').click();
        await page2.waitForSelector('p:has-text("Publication successfully saved")');

        // Check details as old corresponding author
        await page.reload();
        await checkPublicationOnAccountPage(page, { id: publicationId }, "coauthor's new version", false);

        await Promise.all([page.close(), page2.close()]);
    });

    test('Corresponding author can publish from Approvals Tracker', async ({ browser }) => {
        test.slow();
        const page = await Helpers.users.getPageAsUser(browser);

        // create new publication
        await Helpers.publicationCreation.createPublishReadyPublication(page);
        await addCoAuthorsAndRequestApproval(page, [Helpers.users.user2]);

        // check preview page
        await expect(page.getByText('This publication is locked for approval')).toBeVisible();
        await expect(page.locator('table[data-testid="approval-tracker-table"]')).toBeVisible();
        await expect(page.getByText(`${Helpers.users.user1.fullName} (You)`)).toBeVisible();
        await expect(page.getByText('1 more author approval is required before publishing')).toBeVisible();

        // handle co-authors confirmations
        await confirmCoAuthorInvitation(browser, Helpers.users.user2);

        // refresh corresponding author page
        await page.reload();
        await expect(page.getByText(Helpers.users.user2.fullName)).toBeVisible();

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
        const page = await Helpers.users.getPageAsUser(browser);

        // create new publication
        await Helpers.publicationCreation.createPublishReadyPublication(page);
        await addCoAuthorsAndRequestApproval(page, [Helpers.users.user2]);

        // check preview page
        await expect(page.getByText('This publication is locked for approval')).toBeVisible();
        await expect(page.getByText('Your role on this publication: Corresponding author')).toBeVisible();
        await expect(page.locator('table[data-testid="approval-tracker-table"]')).toBeVisible();
        await expect(page.getByText(`${Helpers.users.user1.fullName} (You)`)).toBeVisible();
        await expect(page.getByText('1 more author approval is required before publishing')).toBeVisible();

        // check invited author is visible
        await expect(page.getByText(Helpers.users.user2.email)).toBeVisible();
        await expect(page.locator(`table button[title="Edit email for ${Helpers.users.user2.email}"]`)).toBeVisible();

        // change author's email
        await page.locator(`table button[title="Edit email for ${Helpers.users.user2.email}"]`).click();
        await page.locator('input[name="authorEmail"]').click();
        await page.fill('input[name="authorEmail"]', '');
        await page.fill('input[name="authorEmail"]', Helpers.users.user3.email);

        // confirm email change
        await page.locator('button[title="Change Email"]').click();
        await expect(page.getByText("Are you sure you want to change this author's email?")).toBeVisible();
        await page.locator('button[title="Yes, change email"]').click();
        await expect(page.getByText(Helpers.users.user3.email)).toBeVisible();

        await page.close();
    });

    test('Corresponding author can send reminders', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);

        await Helpers.publicationCreation.createPublishReadyPublication(page);
        await addCoAuthorsAndRequestApproval(page, [Helpers.users.user2]);

        // check preview page
        await expect(page.getByText('This publication is locked for approval')).toBeVisible();
        await expect(page.getByText('Your role on this publication: Corresponding author')).toBeVisible();
        await expect(page.locator('table[data-testid="approval-tracker-table"]')).toBeVisible();
        await expect(page.getByText(`${Helpers.users.user1.fullName} (You)`)).toBeVisible();
        await expect(page.getByText('1 more author approval is required before publishing')).toBeVisible();

        // check invited author is visible
        await expect(page.getByText(Helpers.users.user2.email)).toBeVisible();

        // re-send invitation to 'Unconfirmed Author'
        await expect(page.getByText('Unconfirmed Author')).toBeVisible();
        await page.locator(`table button[title="Resend email to ${Helpers.users.user2.email}"]`).click();
        await expect(page.locator('h3', { hasText: 'Re-Send author invite' })).toBeVisible();
        await page.locator('button[title="Confirm"]').click();

        // check status
        await expect(
            page.locator(`table button[title="Resend email to ${Helpers.users.user2.email}"]`)
        ).not.toBeVisible();
        await expect(page.getByText('Reminder sent at')).toBeVisible();

        // check email
        await page.goto(Helpers.constants.MAILPIT);
        await page
            .locator(`.message:has-text("${Helpers.users.user2.email}")`, {
                hasText: 'You’ve been added as a co-author on Octopus'
            })
            .first()
            .click();

        await expect(
            page.frameLocator('iframe').getByText(`${Helpers.users.user1.fullName} has sent you a reminder`)
        ).toBeVisible();

        await page.close();
    });

    test('Editing a publication removes existing approvals', async ({ browser }) => {
        test.slow();
        const page = await Helpers.users.getPageAsUser(browser);

        await Helpers.publicationCreation.createPublishReadyPublication(page);
        await addCoAuthorsAndRequestApproval(page, [Helpers.users.user2]);

        await confirmCoAuthorInvitation(browser, Helpers.users.user2);

        await page.reload();
        await expect(page.getByText('All authors have approved this publication').first()).toBeVisible();

        await unlockPublication(page);

        // Request approval from co author
        await expect(page.locator(PageModel.publish.requestApprovalButton)).toBeEnabled();
        await requestApproval(page);

        await expect(page.getByText('Approval Pending')).toBeVisible();

        await page.close();
    });

    test('Co-authors are notified if the publication was edited after they confirmed their involvement', async ({
        browser
    }) => {
        test.slow();
        const page = await Helpers.users.getPageAsUser(browser);

        await Helpers.publicationCreation.createPublishReadyPublication(page);
        await addCoAuthorsAndRequestApproval(page, [Helpers.users.user2]);

        await confirmCoAuthorInvitation(browser, Helpers.users.user2);

        // unlock and request approvals again
        await unlockPublication(page);
        await requestApproval(page);

        await verifyLastEmailNotification(
            browser,
            Helpers.users.user2,
            'Changes have been made to a publication that you are an author on'
        );

        await page.close();
    });

    test('Co Authors can edit their affiliations using Approvals Tracker table', async ({ browser }) => {
        const page = await Helpers.users.getPageAsUser(browser);

        // create new publication
        await Helpers.publicationCreation.createPublishReadyPublication(page);
        await addCoAuthorsAndRequestApproval(page, [Helpers.users.user2, Helpers.users.user3]);

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

    test('Corresponding author and co-authors can create multiple versions for a publication', async ({ browser }) => {
        test.slow();
        let page = await Helpers.users.getPageAsUser(browser);

        // create v1
        await Helpers.publicationCreation.createPublication(page, problemPublication.title, 'PROBLEM');
        await Helpers.publicationCreation.completeKeyInformationTab(page);
        await Helpers.publicationCreation.completeAffiliationsTab(page, false);
        await Helpers.publicationCreation.completeLinkedItemsTab(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );
        await Helpers.publicationCreation.completeMainTextTabMinimally(page, 'main text');
        await Helpers.publicationCreation.completeConflictOfInterestTab(page, false);

        // publish v1
        await page.locator(PageModel.publish.publishButton).click();
        await page.locator(PageModel.publish.confirmPublishButton).click();

        await page.locator(`h1:has-text("${problemPublication.title}")`).first().waitFor({ state: 'visible' });

        // get publication id from url and deduct canonical DOI
        const publicationId = page.url().split('/').slice(-3)[0];
        const publicationTestId = 'publication-' + publicationId;

        // create v2 and invite a co-author
        await checkPublicationOnAccountPage(page, { id: publicationId }, 'published once', true);

        // create new version
        await page.getByTestId(publicationTestId).locator(PageModel.myAccount.createDraftVersionButton).click();
        await page.locator('button[title="Confirm"]').click();
        await page.waitForResponse(
            (response) => response.request().method() === 'POST' && response.url().includes('/publication-versions')
        );

        // wait to be redirected to the edit page
        await page.waitForURL('**/edit?**');

        // change title
        let newTitle = problemPublication.title + ' v2';
        const titleInputLocator = 'input[aria-label="Title"]';
        await page.fill(titleInputLocator, newTitle);

        // invite a co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.users.user2);

        // request approvals for v2
        await requestApproval(page);
        await page.locator(`h1:has-text("${newTitle}")`).first().waitFor({ state: 'visible' });
        await page.locator(`h1:has-text("${newTitle}")`).waitFor(); // wait for redirect

        // confirm co-author invitation
        await confirmCoAuthorInvitation(browser, Helpers.users.user2);

        // publish v2
        await page.reload();
        await expect(page.locator(PageModel.publish.publishButtonTracker)).toBeEnabled();
        await page.locator(PageModel.publish.publishButtonTracker).click();
        await Promise.all([
            page.waitForNavigation(),
            page.locator(PageModel.publish.confirmPublishButtonTracker).click()
        ]);

        // close corresponding author session
        await page.close();

        // create new session as co-author
        page = await Helpers.users.getPageAsUser(browser, Helpers.users.user2);

        // create v3 as co-author
        await checkPublicationOnAccountPage(page, { id: publicationId }, 'published', true);

        // create new version
        await page.getByTestId(publicationTestId).locator(PageModel.myAccount.createDraftVersionButton).click();
        await page.locator('button[title="Confirm"]').click();
        await page.waitForResponse(
            (response) => response.request().method() === 'POST' && response.url().includes('/publication-versions')
        );

        // wait to be redirected to the edit page
        await page.waitForURL('**/edit?**');

        // change title to v3
        newTitle = problemPublication.title + ' v3';
        await page.fill(titleInputLocator, newTitle);

        // remove initial corresponding author
        await removeCoAuthor(page, Helpers.users.user1);

        // preview the the new version
        await page.locator(PageModel.publish.previewButton).click();
        await page.locator(`h1:has-text("${newTitle}")`).first().waitFor({ state: 'visible' });

        await page.locator(PageModel.publish.versionsAccordionButton).waitFor();

        // switch between versions
        await expect(
            page.locator('#desktop-versions-accordion p:has-text("Version 3: Currently viewed")')
        ).toBeVisible();
        expect(page.url()).toContain('/versions/latest');

        // switch to v2
        await page.locator('#desktop-versions-accordion a:has-text("Version 2: ")').click();
        await page.waitForURL('**/versions/2');
        await expect(page.locator('#desktop-versions-accordion a:has-text("Version 3: Draft")')).toBeVisible();
        await expect(
            page.locator('#desktop-versions-accordion p:has-text("Version 2: Currently viewed")')
        ).toBeVisible();

        // switch to v1
        await page.locator('#desktop-versions-accordion a:has-text("Version 1: ")').click();
        await page.waitForURL('**/versions/1');
        await expect(page.locator('#desktop-versions-accordion a:has-text("Version 3: Draft")')).toBeVisible();
        await expect(
            page.locator('#desktop-versions-accordion p:has-text("Version 1: Currently viewed")')
        ).toBeVisible();

        // switch back to v3
        await page.locator('#desktop-versions-accordion a:has-text("Version 3: ")').click();
        await page.waitForURL('**/versions/3');

        // go back to edit page
        await page.locator(PageModel.publish.draftEditButton).click();
        await page.waitForURL('**/edit?**');

        // check publish button is now enabled
        await expect(page.locator(PageModel.publish.publishButton)).toBeEnabled();

        // publish v3
        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([
            (page.waitForURL('**/versions/latest'), page.locator(PageModel.publish.confirmPublishButton).click())
        ]);
        await page.locator(`h1:has-text("${newTitle}")`).first().waitFor({ state: 'visible' });
    });

    test('Co-authors can transfer ownership of a new DRAFT version', async ({ browser }) => {
        test.slow();
        const page = await Helpers.users.getPageAsUser(browser);

        // create v1
        await Helpers.publicationCreation.createPublication(page, problemPublication2.title, 'PROBLEM');
        await Helpers.publicationCreation.completeKeyInformationTab(page);
        await Helpers.publicationCreation.completeAffiliationsTab(page, false);
        await Helpers.publicationCreation.completeLinkedItemsTab(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );
        await Helpers.publicationCreation.completeMainTextTabMinimally(page, 'main text');
        await Helpers.publicationCreation.completeConflictOfInterestTab(page, false);

        // invite a co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.users.user2);

        // request approvals for v1
        await requestApproval(page);
        await page.locator(`h1:has-text("${problemPublication2.title}")`).first().waitFor({ state: 'visible' });
        await page.locator(`h1:has-text("${problemPublication2.title}")`).waitFor(); // wait for redirect

        // confirm co-author invitation
        await confirmCoAuthorInvitation(browser, Helpers.users.user2);

        // publish v1
        await page.reload();
        await page.locator(PageModel.publish.publishButtonTracker).click();
        await Promise.all([
            (page.waitForURL('**/versions/latest'), page.locator(PageModel.publish.confirmPublishButtonTracker).click())
        ]);

        // get publication id from url and deduct canonical DOI
        const publicationId = page.url().split('/').slice(-3)[0];
        const publicationTestId = 'publication-' + publicationId;

        // create v2
        await checkPublicationOnAccountPage(page, { id: publicationId }, 'published once', true);

        // create new version
        await page.getByTestId(publicationTestId).locator(PageModel.myAccount.createDraftVersionButton).click();
        await page.locator('button[title="Confirm"]').click();
        await page.waitForResponse(
            (response) => response.request().method() === 'POST' && response.url().includes('/publication-versions')
        );

        // wait to be redirected to the edit page
        await page.waitForURL('**/edit?**');
        await page.click(PageModel.publish.previewButton);
        await page.waitForURL('**/versions/latest');

        // login as co-author and request control over v2
        const page2 = await Helpers.users.getPageAsUser(browser, Helpers.users.user2);

        // navigate to /account page
        await page2.goto('/account');

        // request control over the new version
        const publicationRow = page2.getByTestId(publicationTestId);
        await expect(publicationRow).toContainText(problemPublication2.title);
        await publicationRow.locator(PageModel.myAccount.confirmInvolvementButton).click();
        await page2.waitForURL('**/versions/latest');
        await page2.locator('#desktop-versions-accordion a[title="Take over editing"]').click();
        await page2.click('button[title="Request Control"]');
        await page2.waitForResponse((response) => response.url().includes('/request-control') && response.ok());

        await page2.goto('/account');
        await expect(page2.getByTestId(publicationTestId)).toContainText(
            'You have requested control over this publication version.'
        );

        // transfer ownership to user2
        await approveControlRequest(browser, Helpers.users.user1, Helpers.users.user2.fullName, true);

        // check that old corresponding author doesn't have permissions to edit the DRAFT anymore
        await page.reload();
        await page.waitForLoadState('networkidle');
        await expect(page.getByText('This publication is currently being edited.')).toBeVisible();

        // check that user2 can edit the new version
        await page2.goto(`/publications/${publicationId}/versions/latest`);
        await page2.waitForLoadState('networkidle');
        await expect(page2.locator(PageModel.publish.draftEditButton)).toBeVisible();
        await page2.locator(PageModel.publish.draftEditButton).click();
        await page2.waitForURL('**/edit?**');
        await page2.waitForLoadState('networkidle');
        await expect(page2.locator('aside button:has-text("Key information")').first()).toBeVisible();
    });

    test('Authors can create/edit and request control over new version from "Versions" dropdown', async ({
        browser
    }) => {
        test.slow();
        const page = await Helpers.users.getPageAsUser(browser);

        // create v1
        await Helpers.publicationCreation.createPublication(page, problemPublication2.title, 'PROBLEM');
        await Helpers.publicationCreation.completeKeyInformationTab(page);
        await Helpers.publicationCreation.completeAffiliationsTab(page, false);
        await Helpers.publicationCreation.completeLinkedItemsTab(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );
        await Helpers.publicationCreation.completeMainTextTabMinimally(page, 'main text');
        await Helpers.publicationCreation.completeConflictOfInterestTab(page, false);

        // invite a co-author
        await page.locator('aside button:has-text("Co-authors")').first().click();
        await addCoAuthor(page, Helpers.users.user2);

        // request approvals for v1
        await requestApproval(page);
        await page.locator(`h1:has-text("${problemPublication2.title}")`).first().waitFor({ state: 'visible' });
        await page.locator(`h1:has-text("${problemPublication2.title}")`).waitFor(); // wait for redirect

        // confirm co-author invitation
        await confirmCoAuthorInvitation(browser, Helpers.users.user2);

        // publish v1
        await page.reload();
        await page.locator(PageModel.publish.publishButtonTracker).click();
        await page.locator(PageModel.publish.confirmPublishButtonTracker).click();
        await page.locator('aside a:has-text("Create New Version")').waitFor();
        await expect(page.locator('aside a:has-text("Create New Version")')).toBeVisible();

        const publicationUrl = page.url();

        // login as co-author
        const page2 = await Helpers.users.getPageAsUser(browser, Helpers.users.user2);
        await page2.goto(publicationUrl);
        await page2.locator('aside button[title="Versions"]').waitFor();

        // create v2 from 'Versions' dropdown
        await expect(page2.locator('aside button[title="Versions"]')).toBeVisible();
        await expect(page2.locator('aside a:has-text("Create New Version")')).toBeVisible();
        await page2.locator('aside a:has-text("Create New Version")').click();
        await page2.locator('button[title="Confirm"]').click();

        // wait to be redirected to the edit page
        await page2.waitForURL('**/edit?**');

        // go back to preview page
        await page2.click(PageModel.publish.previewButton);
        await page2.waitForURL('**/versions/latest');

        // check co-author has option to 'Edit Draft' from 'Versions' dropdown
        await expect(page2.locator('a:has-text("Edit Draft")')).toBeVisible();
        await page2.close();

        // check previous corresponding author can 'Take over editing' from the 'Versions' dropdown
        await page.reload();
        await page.locator('aside button[title="Versions"]').waitFor();
        await expect(page.locator('aside button[title="Versions"]')).toBeVisible();
        await expect(page.locator('aside a:has-text("Take over editing")')).toBeVisible();

        await page.locator('aside a:has-text("Take over editing")').click();
        await page.locator('button[title="Request Control"]').click();
        await page.waitForResponse(
            (response) => response.url().includes('/publication-versions/latest/request-control') && response.ok()
        );
        await page.getByText('You have requested control over this publication version.').waitFor();
        await expect(page.getByText('You have requested control over this publication version.')).toBeVisible();
        await page.close();
    });
});

test.describe('Publication Flow + File import', () => {
    let page: Page;
    const assetsDirName = path.join(__dirname, '../../assets/');

    const openFileImportModal = async (page: Page, filePath: string) => {
        await page.locator(PageModel.publish.fileImportButtonModal).click();
        await page.locator(PageModel.publish.fileImportButton).setInputFiles(filePath);
    };

    test.beforeAll(async ({ browser }) => {
        page = await Helpers.users.getPageAsUser(browser);
    });

    test.afterAll(async () => {
        page.close();
    });

    test('Create PROBLEM publication where text is filled from document import', async () => {
        await Helpers.publicationCreation.createPublication(page, 'test publication - file import', 'PROBLEM');
        await Helpers.publicationCreation.completeKeyInformationTab(page);
        await Helpers.publicationCreation.completeAffiliationsTab(page, false);
        await Helpers.publicationCreation.completeLinkedItemsTab(
            page,
            'living organisms',
            'How do living organisms function, survive, reproduce and evolve?'
        );

        // import initial playwright file
        await openFileImportModal(page, assetsDirName + 'Playwright.docx');
        await page.locator(PageModel.publish.insertButton).click();

        // Ensure modal has closed and file import
        await expect(page.locator(PageModel.publish.importModal)).not.toBeVisible();
        await expect(page.locator(PageModel.publish.text.editor)).toContainText('File Import – Playwright');

        // replace playwright file
        await openFileImportModal(page, assetsDirName + 'Playwright - Replace.docx');
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

        await Helpers.publicationCreation.completeConflictOfInterestTab(page, false);

        await page.locator(PageModel.publish.publishButton).click();
        await Promise.all([
            page.waitForURL('**/versions/latest'),
            page.locator(PageModel.publish.confirmPublishButton).click()
        ]);

        await expect(page.getByText('File Import – Playwright')).toBeVisible();
    });

    test('Upload images to "Main text" only allows specific formats: png, jpg, jpeg, apng, avif, gif, webp', async () => {
        await Helpers.publicationCreation.createPublication(page, 'test publication - image upload', 'PROBLEM');
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
            assetsDirName + 'apng-image-test.png',
            assetsDirName + 'avif-image-test.avif',
            assetsDirName + 'gif-image-test.gif',
            assetsDirName + 'jpeg-image-test.jpeg',
            assetsDirName + 'jpg-image-test.jpg',
            assetsDirName + 'webp-image-test.webp'
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
                page.locator(`div[contenteditable="true"] img[title="${image.split(assetsDirName).pop()}"]`)
            ).toBeVisible();
        }

        // try do upload a wrong file format
        await uploadImageButton.click();
        const [fileChooser2] = await Promise.all([
            page.waitForEvent('filechooser'),
            page.click('label[for="file-upload"]')
        ]);
        await fileChooser2.setFiles([assetsDirName + 'Playwright.docx']);
        await page.click('button[title="Upload image"]');
        await expect(page.getByText('Failed to upload "Playwright.docx". The format is not supported.')).toBeVisible();
    });
});

test.describe('Text Editor', () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        page = await Helpers.users.getPageAsUser(browser);
    });

    test.afterAll(async () => {
        page.close();
    });

    test('Add formula button adds placeholder KaTeX formula', async () => {
        await Helpers.publicationCreation.createPublication(page, 'test insert formula button', 'PROBLEM');
        await page.waitForSelector('button:has-text("Main text")');
        await page.click('button:has-text("Main text")');

        const addFormulaButton = page.locator('button[title="Add formula"]');
        await expect(addFormulaButton).toBeVisible();
        await addFormulaButton.click();

        await expect(page.locator(PageModel.publish.text.editor)).toContainText('$$Enter KaTeX expression$$');
    });
});
