# Octopus E2E Tests

These are the Octopus end to end tests built using [playwright](https://playwright.dev/).

## Prerequisites

-   Obtain credentials to allow access to the ORCID Public/Member API.
-   Obtain credentials to allow access to the DataCite API.
-   Create your environment file as described below.
-   Internet connection (needed to auth with the ORCID Sandbox).
-   Install dependencies with `npm i`.

### Environment File

Create a .env file inside `{project root}/e2e` using `cp .env.example .env.`.

Make sure to update the values within to match your environment.

## Getting Started

### Running via command line

To begin running the tests you can run `npm run test` which will invoke playwright to run all tests within the `/tests` folder.

You can use the playwright command line tools to run specific tests, or use other features available with it by running `npx playwright <command>`.

#### Further dependencies

If it is your first time using playwright, you might need to install some further dependencies so that it can do things such as launch browsers correctly. You can attempt to run the tests and playwright will suggest what you need to install in the output of failed tests, or you can install what you need in advance:

- `npx playwright install`
- `npx playwright install-deps`

### Running via VSCode

You can also run the tests through VSCode using the extension [Playwright Test for VSCode](https://playwright.dev/docs/getting-started-vscode).

You can find more documentation about this linked above.

### WSL Issues with running in --headed mode

There are some issues with WSL when running in headed mode. If you do not see a browser window appear, then you might have to look for alternative solutions such as using software like VcXsrv Windows X Server.

### Playwright config

The playwright config can be found under `playwright.config.ts`; you might want to review this to ensure you understand how the tests are being performed.

## The tests

The tests are split into two main categories: LoggedIn and LoggedOut.

### Logged Out

These test areas of the site that do not need authentication. They are split into respective parts of the site:

```
browse.e2e.spec.ts
inaccessiblePages.e2e.spec.ts
livePublication.e2e.spec.ts
profile.e2e.spec.ts
search.e2e.spec.ts
staticPages.e2e.spec.ts
```

### Logged In

These test areas of the site that do require authentication. They are split into respective parts of the site:

```
browse.e2e.spec.ts
livePublication.e2e.spec.ts
login.e2e.spec.ts
profile.e2e.spec.ts
publish.e2e.spec.ts
revokeOrcidAccess.spec.ts
search.e2e.spec.ts
```

### Helper files

There are two files that are used throughout, which contain commonly used features and functions: `helpers.ts` and `PageModel.ts`.

### Assets

The assets folder contains items that are used within certain tests to ensure that a feature of the site is working.
