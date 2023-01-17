import { Browser, expect, Locator, Page} from '@playwright/test';
import {PageModel} from './PageModel';

export const UI_BASE = process.env.UI_BASE || "https://localhost:3001";

const requiredEnvVariables = [
  "ORCID_TEST_USER",
  "ORCID_TEST_PASS",
  "ORCID_TEST_FIRST_NAME",
  "ORCID_TEST_LAST_NAME",
  "ORCID_TEST_USER2",
  "ORCID_TEST_PASS2",
  "ORCID_TEST_FIRST_NAME2",
  "ORCID_TEST_LAST_NAME2",
  "ORCID_TEST_USER3",
  "ORCID_TEST_PASS3",
  "ORCID_TEST_FIRST_NAME3",
  "ORCID_TEST_LAST_NAME3",
];

function checkEnvVariable(variableName: string) {
  if (process.env[variableName] === undefined) {
    throw new Error(`Environment Variable '${variableName}' is undefined.`);
  }
}

requiredEnvVariables.forEach(checkEnvVariable);

export type TestUser = {
  email: string;
  password: string;
  shortName: string;
  fullName: string;
};

// test user 1
export const user1: TestUser = {
  email: process.env.ORCID_TEST_USER,
  password: process.env.ORCID_TEST_PASS,
  shortName: `${process.env.ORCID_TEST_FIRST_NAME?.[0]}. ${process.env.ORCID_TEST_LAST_NAME}`,
  fullName: `${process.env.ORCID_TEST_FIRST_NAME} ${process.env.ORCID_TEST_LAST_NAME}`,
};

// test user 2
export const user2: TestUser = {
  email: process.env.ORCID_TEST_USER2,
  password: process.env.ORCID_TEST_PASS2,
  shortName: `${process.env.ORCID_TEST_FIRST_NAME2?.[0]}. ${process.env.ORCID_TEST_LAST_NAME2}`,
  fullName: `${process.env.ORCID_TEST_FIRST_NAME2} ${process.env.ORCID_TEST_LAST_NAME2}`,
};

// test user 3
export const user3: TestUser = {
  email: process.env.ORCID_TEST_USER3,
  password: process.env.ORCID_TEST_PASS3,
  shortName: `${process.env.ORCID_TEST_FIRST_NAME3?.[0]}. ${process.env.ORCID_TEST_LAST_NAME3}`,
  fullName: `${process.env.ORCID_TEST_FIRST_NAME3} ${process.env.ORCID_TEST_LAST_NAME3}`,
};

export const login = async (page: Page, browser: Browser, user = user1) => {
  await Promise.all([
    page.waitForNavigation(),
    page.click(PageModel.header.loginButton),
  ]);

  await page.fill(PageModel.login.username, user.email);
  await page.fill(PageModel.login.password, user.password);

  await Promise.all([
    page.waitForNavigation(), // wait to see if authorization is required
    page.click(PageModel.login.signInButton),
  ]);

  // check if need to authorize access
  const needsAuthorization = page.url().includes("/oauth/authorize");

  if (needsAuthorization) {
    await page.click(PageModel.login.authorizeButton);
    await page.waitForNavigation();
  }

  await page.waitForSelector(PageModel.header.usernameButton);

  // check if email verification is required
  const needsEmailVerification =
      (await page.title()) === "Complete your registration";

  if (needsEmailVerification) {
    await page.fill("#email", user.email);
    await page.click('button[title="Send code"]');
    await page.waitForSelector("#code");

    // open new tab
    const context = await browser.newContext();
    const [newPage] = await Promise.all([
      context.waitForEvent("page"),
      context.newPage(),
    ]);

    // navigate to MailHog and take the last verification code
    await newPage.goto(`http://localhost:8025/`);
    await newPage.getByText("Verify your Octopus account").first().click();
    const verificationCode = await newPage
        .frameLocator("iframe")
        .locator("p.code")
        .textContent();

    // close new tab
    await newPage.close();

    await page.fill("#code", verificationCode);
    await page.click('button[title="Verify code"]');
    await page.waitForNavigation(); // wait for redirect
  }
};

export const logout = async (page: Page) => {
  await page.click(PageModel.header.usernameButton);
  await page.click(PageModel.header.logoutButton);
  await page.waitForLoadState();
  await expect(page.locator(PageModel.header.loginButton)).toBeVisible();
};

export const selectFirstPublication = async (
    page: Page,
    type: string = "PROBLEM"
) => {
  await page.goto(`${UI_BASE}/search?for=publications&type=${type}`);
  await page.locator(`article`).first().click();
};

export const search = async (
    page: Page,
    searchTerm: string,
    publicationSearchResult?: string
) => {
  // Navigate to search page
  await page.locator(PageModel.header.searchButton).click();
  await page.locator(PageModel.search.searchInput).click();

  // Type in search term
  await page.keyboard.type(searchTerm);
  await page.keyboard.press("Enter");
  await expect(page.locator("h1")).toHaveText(
      `Search results for ${searchTerm}`
  );

  // if (publicationSearchResult passed in) expect its href anchor to be visible
  publicationSearchResult && await expect(page.locator(publicationSearchResult)).toBeVisible();
};

export const checkLivePublicationLayout = async (
    page: Page,
    id: string,
    loggedIn?: boolean
) => {
  // Go to live publication page
  await page.goto(`${UI_BASE}/publications/${id}`, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.locator("h1")).toBeVisible();

  // Check visualisation, content, linked problems, funders, conflict of interest sections
  for (const visibleSection of PageModel.livePublication.visibleSections) {
    await expect(
        page.locator(`${visibleSection}`).locator("visible=true")
    ).toBeVisible();
  }

  // Expect DOI link
  await expect(page.locator(PageModel.livePublication.doiLink)).toHaveAttribute(
      "href",
      `https://doi.org/10.82259/${id}`
  );

  if (loggedIn) {
    // Confirm review link
    await page
        .locator(PageModel.livePublication.writeReview)
        .locator("visible=true")
        .click();
    await expect(page).toHaveURL(
        `${UI_BASE}/create?for=${id}&type=PEER_REVIEW`
    );
  }
};

export const clickFirstPublication = async (page: Page): Promise<void> => {
  const firstPublication = page.locator(PageModel.search.firstPublication);
  const firstPublicationPath = await firstPublication.getAttribute('href');
  await firstPublication.click();

  // expect URL to contain publication path
  await expect(page).toHaveURL(`${UI_BASE}${firstPublicationPath}`);
}

export const testDateInput = async (page: Page, dateFromInput: Locator, dateToInput: Locator): Promise<void> => {
  await expect(dateFromInput).toHaveAttribute('value', PageModel.search.dateFrom);
  await expect(dateToInput).toHaveAttribute('value', PageModel.search.dateTo);

  await expect(page).toHaveURL(new RegExp(`dateFrom=${PageModel.search.dateFrom}`));
  await expect(page).toHaveURL(new RegExp(`dateTo=${PageModel.search.dateTo}`));
}
