<img src="https://www.jisc.ac.uk/sites/all/themes/jisc_clean/img/jisc-logo.svg" align="right" width=50 height=50/><h1 align="left">Octopus UI</h1>

The Octopus UI is a [Next.js](https://nextjs.org/) project bootstrapped with [create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

---

## Getting started

Create a `.env` file inside `~/ui` using `cp .env.example .env`. Update it to add your ORCID (the same one you used in the api .env file):

```
# set to same as ORCID_ID in api .env file
NEXT_PUBLIC_ORCID_APP_ID=PUT_ORCID_APP_ID_HERE
```

Leave the rest of the file as is.

To start the UI, in the **UI directory** run:

```bash
$ ~/ui$ npm i
$ ~/ui$ npm run dev
```

Open [https://localhost:3001](https://localhost:3001) with your browser to see the result.

To view any dynamic pages, you will also need to start the API. More information can be found in the [API readme](../api/README.md).

---

## Technologies

### Languages

-   [TypeScript](https://www.typescriptlang.org/) - [See config](./tsconfig.json)

### Frameworks

-   [Next.js](https://nextjs.org/) - [See config](./next.config.js)
-   [Tailwind CSS](https://tailwindcss.com/) - [See config](./tailwind.config.js)

### Libraries

-   [Framer Motion](https://www.framer.com/motion/)
-   [Luxon](https://moment.github.io/luxon/)
-   [PostCSS](https://postcss.org/)
-   [SWR](https://swr.vercel.app/)
-   [Zustand](https://github.com/pmndrs/zustand/)

### Linting

-   [ESLint](https://eslint.org/) - [See config](./.eslintrc.json)
-   [Prettier](https://prettier.io/) - [See config](./.prettierrc.json)

---

## Maintenance mode

To put the site into maintenance mode, each request will render a page with a maintenance message, set the following environment variables:
- NEXT_PUBLIC_MAINTENANCE_MODE: if `true`, the maintenance page will render for each request.
- NEXT_PUBLIC_MAINTENANCE_MESSAGE: if the value is not set or `null`, a default message will be shown on the maintenance page. Otherwise, the value of this variable will be shown.

Note that if you change the value of environment variables on AWS Amplify, the app version will need to be redeployed for them to be picked up.

---
## Testing

End-to-end tests use [Playwright](https://playwright.dev/).

To run the tests you need to set the following in the .env file to match a test ORCID account (it doesn't have to be the same account used for the NEXT_PUBLIC_ORCID_APP_ID):

```
ORCID_TEST_FIRST_NAME=<first name as defined in orchid account>
ORCID_TEST_LAST_NAME=<last name as defined in orchid account>
ORCID_TEST_USER=
ORCID_TEST_PASS=

```

You need the API and the UI to be running. To run the tests use:

```bash
$ ~/ui $ npm run test:e2e

```


---

## Workflows on push

We have a job which utilises [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) to run an accessibility audit on all pages - [See config](./lighthouserc.js). If the accessibility score falls below 95, the action will fail and all accessibility failures will be outputted.

---
