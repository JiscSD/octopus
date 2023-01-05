import { Browser, expect, Page } from "@playwright/test";
import { PageModel } from "./PageModel";

export const ORCID_TEST_USER = process.env.ORCID_TEST_USER;
export const ORCID_TEST_PASS = process.env.ORCID_TEST_PASS;
export const ORCID_TEST_NAME = `${process.env.ORCID_TEST_FIRST_NAME} ${process.env.ORCID_TEST_LAST_NAME}`;
export const ORCID_TEST_SHORT_NAME = `${process.env.ORCID_TEST_FIRST_NAME?.[0]}. ${process.env.ORCID_TEST_LAST_NAME}`;

export const UI_BASE = process.env.UI_BASE || "https://localhost:3001";

if (!ORCID_TEST_USER || !ORCID_TEST_PASS || !ORCID_TEST_NAME)
  throw "Environment variables not set";

export const login = async (page: Page, browser: Browser) => {
  await Promise.all([
    page.waitForNavigation(),
    page.click(PageModel.header.loginButton),
  ]);

  await page.fill(PageModel.login.username, ORCID_TEST_USER);
  await page.fill(PageModel.login.password, ORCID_TEST_PASS);

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
    await page.fill("#email", ORCID_TEST_USER);
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
  publicationSearchResult: string
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
  await expect(page.locator(publicationSearchResult)).toBeVisible();
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
