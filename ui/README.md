<img src="public/images/jisc-logo.svg" align="right" width=50 height=50/><h1 align="left">Octopus UI</h1>

The Octopus UI is a [Next.js](https://nextjs.org/) project bootstrapped with [create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

---

## Getting started

Create a `.env` file inside `~/ui` using `cp .env.example .env`. Update it to add the ORCID app ID (the same one you used in the api .env file), and the contentful space ID and access token if you want to see real blog posts on the blog pages:

```
NEXT_PUBLIC_ORCID_APP_ID=PUT_ORCID_APP_ID_HERE
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=PUT_CONTENTFUL_SPACE_ID_HERE
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=PUT_CONTENTFUL_ACCESS_TOKEN_HERE
```

Leave the rest of the file as is.

We use the math extension for the tiptap rich text editor, which comes from an authenticated repository. Create a `.npmrc` file in this directory and give it the following contents, replacing `${TIPTAP_PRO_TOKEN}` with our token:

```
@tiptap-pro:registry=https://registry.tiptap.dev/
//registry.tiptap.dev/:_authToken=${TIPTAP_PRO_TOKEN}
```

Then the dependencies can all be installed by running `npm i`.

Alternatively, as a one-off, this can be done in one command, again replacing `${TIPTAP_PRO_TOKEN}` with our token. However, this won't persist in the same way using the `.npmrc` file will. This is mainly intended for installing dependencies in CI tasks. Example usage:

`npm run customInstall --tiptap_token=${TIPTAP_PRO_TOKEN}`

To start the UI application, run: `npm run dev`. Open [https://localhost:3001](https://localhost:3001) with your browser to see the result.

To view any dynamic pages, you will also need to start the API. More information can be found in the [API readme](../api/README.md).

### Warning about self-signed certificate generation

Note: because of the `--experimental-https` flag, the process may prompt for your password in order to generate a self-signed certificate. Due to the use of concurrently to run multiple processes under one command, this can get a bit lost or unclear in the output, e.g.:

```
[next] ⚠ Self-signed certificates are currently an experimental feature, use with caution.
[next] Downloading mkcert package...
[next] Download response was successful, writing to disk
[next] Attempting to generate self signed certificate. This may prompt for your password
Sudo password:[types]
[types] 12:02:13 PM - Found 0 errors. Watching for file changes.
```

From this output, you are free to type the password; the certificate will be generated and the command will proceed correctly.

---

## Working with the UI

If you add a new static page to the site, remember to add it to the array of static page names in the static pages sitemap at `src/pages/sitemaps/static.xml.tsx`.

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

## Testing

UI tests use [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

To run the tests, run the command `npm run test`.

---

## Workflows on push

We have a job which utilises [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) to run an accessibility audit on all pages - [See config](./lighthouserc.js). If the accessibility score falls below 95, the action will fail and all accessibility failures will be outputted.

---
