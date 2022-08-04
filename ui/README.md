<img src="https://www.jisc.ac.uk/sites/all/themes/jisc_clean/img/jisc-logo.svg" align="right" width=50 height=50/><h1 align="left">Octopus UI</h1>

The Octopus UI is a [Next.js](https://nextjs.org/) project bootstrapped with [create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

---

## Getting started

To start the UI, in the **UI directory** run:

```bash
$ ~/ui$ npm i
$ ~/ui$ npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

## Testing

End-to-end tests will be written using [Playwright](https://playwright.dev/) (TBC).

---

## Workflows on push

We have a job which utilises [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) to run an accessibility audit on all pages - [See config](./lighthouserc.js). If the accessibility score falls below 95, the action will fail and all accessibility failures will be outputted.

---
