<img src="https://www.jisc.ac.uk/sites/all/themes/jisc_clean/img/jisc-logo.svg" align="right" width=50 height=50/><h1 align="left">Octopus API</h1>

The Octopus UI is a [Prisma](https://www.prisma.io/) project, using [PostgreSQL](https://www.postgresql.org/)

## Prerequisites

-   Install [Node.js](https://github.com/nodejs/node) `v14`.
    -   Recommended: use [`nvm`](https://github.com/nvm-sh/nvm) for managing Node.js versions.
-   [Serverless](https://www.serverless.com/).
-   [Docker Compose](https://docs.docker.com/get-docker/).
-   .env file.

### Environment File

Create a `.env` file inside `api/prisma` with credentials to connect to the postgres db which is hosted in the provided docker container.

## Local setup

To run the API locally:

First, start up Docker Desktop and within the **root directory** run:

```bash
docker compose up
```

All of the following commands should be ran at the root of this directory (`~/api`).

Then, open another terminal and within the **API directory** run:

```bash
~/api$ npm i
```

To start the API:

```bash
~/api$ npm run start:local
```

To run all tests locally:

```bash
~/api$ npm run test:local
```

---

# Prisma

## Commands

Whenever a change is made to the Prisma Schema you must run `npx prisma generate` in order for the Prisma Client to update.  
If you do not run this, the application
code will break as the client will not reflect the latest schema.

```bash
~/api$ npx prisma generate
```

Migrate and reseed the database:

```bash
~/api$ npm run seed:local
```

Create a new migration:

```bash
~/api$ npx prisma migrate dev --name new_migration_name
```

You can then apply the changes made by the new migration using the two commands above (generate and migrate reset).

More information on migrations in Prisma can be found here: [https://www.prisma.io/docs/concepts/components/prisma-migrate/]('https://www.prisma.io/docs/concepts/components/prisma-migrate/').

---

## Technologies

### Languages

-   [TypeScript]('https://www.typescriptlang.org/') - [See config]('./tsconfig.json')
-   [PostgreSQL](https://www.postgresql.org/)

### ORM

-   [Prisma]('https://www.prisma.io/')

### Libraries

-   [Luxon]('https://moment.github.io/luxon/')
-   [Middy]('https://middy.js.org/')
-   [AJV]('https://ajv.js.org/')

### Linting

-   [ESLint]('https://eslint.org/') - [See config]('./.eslintrc.json')
-   [Prettier]('https://prettier.io/') - [See config]('./.prettierrc.json')

---

## Testing

API tests are written in [Jest]('https://jestjs.io/') and each endpoint has tests written to ensure the code is correct and working.

---

## Workflows on push

We have a job which runs the API test suite through github-actions. If any of the API tests fail, then the action will fail.

---
