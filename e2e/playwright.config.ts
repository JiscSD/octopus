import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';
import * as dotenv from 'dotenv';

/**
 * Read environment variables from .env file.
 * https://github.com/motdotla/dotenv
 */
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
    testDir: './tests',
    /* Maximum time one test can run for. */
    timeout: 180000, // some of the publication flow and coauthor tests exceed 2 minutes. We should try and streamline them but for now set this to 3 mins
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 10000
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Give failing tests one retry attempt */
    retries: 1,
    /* Running tests in parallel speeds up overall testing time but it also increases the chance of failing tests eg: one or more tests are manipulating the same DB resource */
    workers: 3,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.UI_BASE,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        ignoreHTTPSErrors: true
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'setup',
            testMatch: '**/*.setup.ts'
        },
        {
            name: 'chromium - logged in',
            use: {
                ...devices['Desktop Chrome']
            },
            testMatch: 'LoggedIn/**',
            dependencies: ['setup']
        },
        {
            name: 'firefox - logged in',
            use: {
                ...devices['Desktop Firefox']
            },
            testMatch: 'LoggedIn/**',
            dependencies: ['setup']
        },
        {
            name: 'chromium - logged out',
            testMatch: 'LoggedOut/**',
            use: {
                ...devices['Desktop Chrome']
            }
        },
        {
            name: 'firefox - logged out',
            testMatch: 'LoggedOut/**',
            use: {
                ...devices['Desktop Firefox']
            }
        }
    ]

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    // outputDir: 'test-results/',

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   port: 3000,
    // },
};

export default config;
