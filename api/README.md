<img src="https://www.jisc.ac.uk/sites/all/themes/jisc_clean/img/jisc-logo.svg" align="right" width=50 height=50/><h1 align="left">Octopus API</h1>

The Octopus UI is a [Prisma](https://www.prisma.io/) project, using [PostgreSQL](https://www.postgresql.org/)

## Prerequisites

-   Install [Node](https://github.com/nodejs/node) `v14` (`v14.18.1` or greater).
-   Recommended: use [`nvm`](https://github.com/nvm-sh/nvm) for managing Node.js versions.
-   Install [Docker](https://docs.docker.com/get-docker).
-   Install [Serverless](https://www.serverless.com).
-   Obtain credentials to allow access to the [ORCID Public/Member API](https://info.orcid.org/documentation/integration-guide/registering-a-public-api-client/).
-   Obtain credentials to allow access to the [DataCite API](https://support.datacite.org/docs/api).
-   Create your environment file as described below.

### Environment File

Create a `.env` file inside `~/api` using `cp .env.example .env`.

Make sure to update the values within to match your environment.

```bash
DATABASE_URL="postgresql://mydbuser:mydbpwd@localhost:5435/postgres?schema=public"
ORCID_SECRET=ORCID_SECRET_FROM_APP
ORCID_ID=APP-ORCID_APP_ID_FROM_APP
JWT_SECRET=abcdefghijklmnopqrstuvwxyz
STAGE=local
EMAIL_SENDER_ADDRESS=no-reply@local.ac
BASE_URL=https://localhost:3001
AUTHORISATION_CALLBACK_URL=${BASE_URL}/login
ELASTICSEARCH_PROTOCOL=http
ELASTICSEARCH_USER=admin
ELASTICSEARCH_PASSWORD=admin
ELASTICSEARCH_ENDPOINT=localhost:9200
VALIDATION_CODE_EXPIRY=10
VALIDATION_CODE_ATTEMPTS=3

DOI_PREFIX=DATACITE_DOI_PREFIX
DATACITE_ENDPOINT=https://api.test.datacite.org/dois
DATACITE_USER=DATACITE_API_USER
DATACITE_PASSWORD=DATACITE_API_PASSWORD
```

## Getting started

First, start up Docker Desktop and within the **root directory** run:

```bash
docker compose up
```

All of the following commands should be ran at the root of this directory (`~/api`).

Then, open another terminal and within the **API directory** run:

```bash
~/api$ npm i
```

Then you can seed the database and start the API:

```bash
$ ~/api$ npm run seed:local
$ ~/api$ npm run start:local
```

To run all tests locally (the API must be running first):

```bash
~/api$ npm run test:local
```

To view the UI, you will also need to start the UI Next.js application. More information can be found in the [UI readme](../ui/README.md).

---

# Prisma

## Commands

Whenever a change is made to the Prisma Schema you must run `npx prisma generate` in order for the Prisma Client to update.  
If you do not run this, the application code will break as the client will not reflect the latest schema.

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

More information on migrations in Prisma can be found here: [Prisma Migrate Documentation](https://www.prisma.io/docs/concepts/components/prisma-migrate/).

---

## Technologies

### Languages

-   [TypeScript](https://www.typescriptlang.org/) - [See config]('./tsconfig.json')
-   [PostgreSQL](https://www.postgresql.org/)

### ORM

-   [Prisma](https://www.prisma.io/)

### Libraries

-   [Luxon](https://moment.github.io/luxon/)
-   [Middy](https://middy.js.org/)
-   [AJV](https://ajv.js.org/)

### Linting

-   [ESLint](https://eslint.org/) - [See config]('./.eslintrc.json')
-   [Prettier](https://prettier.io/) - [See config]('./.prettierrc.json')

---

## Testing

API tests are written in [Jest](https://jestjs.io/) and each endpoint has tests written to ensure the code is correct and working. These can be run manually using `npm run test:local`.

---
