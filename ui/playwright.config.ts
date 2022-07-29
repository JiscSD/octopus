// playwright.config.ts
import { devices, type PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Read from default ".env" file.
dotenv.config();

const config: PlaywrightTestConfig = {
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    use: {
        trace: 'on-first-retry',
        ignoreHTTPSErrors: true,
        headless: false,
        launchOptions: {
            slowMo: 100
        }
    },
    // TODO uncomment firefox once tests are written
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        }
        // {
        //     name: 'firefox',
        //     use: { ...devices['Desktop Firefox'] }
        // }
    ]
};
export default config;
