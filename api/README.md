<img src="https://www.jisc.ac.uk/sites/all/themes/jisc_clean/img/jisc-logo.svg" align="right" width=50 height=50/><h1 align="left">Octopus API</h1>

The Octopus API is a [Prisma](https://www.prisma.io/) project, using [PostgreSQL](https://www.postgresql.org/).

## Prerequisites

-   Install [Node](https://github.com/nodejs/node) `v18`.
-   Recommended: use [`nvm`](https://github.com/nvm-sh/nvm) for managing Node.js versions.
-   Install [Docker](https://docs.docker.com/get-docker).
-   Install [Serverless](https://www.serverless.com).
-   Obtain credentials to allow access to the [ORCID Public/Member API](https://info.orcid.org/documentation/integration-guide/registering-a-public-api-client/).
-   Obtain credentials to allow access to the [DataCite API](https://support.datacite.org/docs/api).
-   Create your environment file as described below.

### Environment File

Create a `.env` file inside `~/api` using `cp .env.example .env`.

Make sure to update the values within to match your environment.

#### Changes to .env file

When adding a new item to the .env file, make sure to update the environment variables in the docker-compose.yml file so the API tests can access them.

### AWS Credentials File

You will need an octopus credential profile to run locally. This can be populated with the dummy data below:

```bash
[octopus]
aws_access_key_id=xxx
aws_secret_access_key=yyy
aws_session_token=zxcxczcx
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

## Prisma

### Commands

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

## Opensearch

This provides a search index for publications. Locally, it runs in a docker container, and on AWS it runs as a [dedicated service](https://aws.amazon.com/opensearch-service/). Other searchable models such as authors and topics aren't stored in opensearch - their search functions use prisma.

The field mapping of the index is not explicitly defined; it is set automatically when a document is inserted into it.

## Reindexing

There is a script which deletes and recreates the publications index, inserting a document into it for each live publication. This can be run from the api directory with `npm run reindex`.

A similar process happens when the database is seeded. After publications are inserted into the database, they are also fed into a blank opensearch index.

---

## Technologies

### Languages

-   [TypeScript](https://www.typescriptlang.org/) - [See config]('./tsconfig.json')
-   [PostgreSQL](https://www.postgresql.org/)

### ORM

-   [Prisma](https://www.prisma.io/)

### Search

-   [Opensearch](https://opensearch.org/)

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

## Overridden dependencies

This is a place to track where we have added dependency overrides in package.json and explain why so that we can understand when they're no longer necessary.

-   fast-xml-parser ^4.2.5: to address [dependabot alert](https://github.com/JiscSD/octopus/security/dependabot/59)
-   http-cache-semantics ^4.1.1: to address [dependabot alert](https://github.com/JiscSD/octopus/security/dependabot/45)
-   micromatch ^4.0.6: to address two vulnerabilities ([1](https://security.snyk.io/vuln/SNYK-JS-BRACES-6838727), [2](https://security.snyk.io/vuln/SNYK-JS-MICROMATCH-6838728)) introduced via copy-webpack-plugin's dependency on this package.
