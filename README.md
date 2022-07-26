<img src="https://www.jisc.ac.uk/sites/all/themes/jisc_clean/img/jisc-logo.svg" align="right" width=50 height=50/><h1 align="left">Octopus</h1>

![ui-tasks](https://github.com/JiscSD/octopus/actions/workflows/ui-tasks.yml/badge.svg)

---

## Octopus Project Overview

**Octopus. The primary research record.**  
A new way to publish your scientific work that's fast, free and fair.

-   The place to establish priority and record your work in full detail, Octopus is free to use and publishes all kinds of scientific work, whether it is a hypothesis, a method, data, an analysis or a peer review.
-   Publication is instant. Peer review happens openly. All work can be reviewed and rated.
-   Your personal page records everything you do and how it is rated by your peers.
-   Octopus encourages meritocracy, collaboration and a fast and effective scientific process.

---

## Prerequisites

To run this application locally you will need:

-   [Node v14 (v14.18.1 or greater)](https://nodejs.org/en/about/releases/)
-   [Docker](https://www.docker.com/)
-   [Serverless Framework](https://www.serverless.com/)
-   [AWS Credentials File](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

## Getting started
-   [API instructions](./api/README.md)
-   [UI instructions](./ui/README.md)

## Authentication

Octopus makes use of [ORCID](https://orcid.org) as a means of authenticating end users.

You will need to register a client with ORCID and enter your application ID and secret into your .env file as described in the [API instructions]((./api/README.md)).

-   [Registering a Public API client](https://info.orcid.org/documentation/integration-guide/registering-a-public-api-client/)
-   [ORCID documentation](https://info.orcid.org/documentation)

In addition to this **only allow users who have verified their email address** can access areas of the site which require authentication (such as publishing content or accepting co-author status). The process of verification is explained below.

## Email verification

Once an end user has logged in using their ORCID account, they will be prompted to verify their email address. This ensures that notifications can be successfully delivered to the recipient, as by default a user's email address in ORCID is not shared.

On reaching `/verify` The flow for this is as follows:

1. User enters their email address, and requests a code be sent to them.
2. A short 7 character code (eg. `UR10WDK`) is then emailed to the provided address.
3. The user then enters this code in the supplied field, and clicks to verify.
4. The user is then redirected to their previously entered destination (if supplied).

On successful verification, the user email address is added to their account, and they will not be prompted again.

Successive failures will result in a code being invalidated, requiring a new code to be sent.

Codes remain valid for a set period in minutes, and beyond this the code is no longer accepted by the API.

The thresholds for both validity period and successive falures are set within the [API](./api/README.md) `.env` file as `VALIDATION_CODE_EXPIRY` (in minutes) and `VALIDATION_CODE_ATTEMPTS` (the number of permitted attempts) respectively.

If a user has not received a code, or has entered the incorrect email address, they are also presented with an option to update their email address or to send a new code.

### Updating email

A previously verified user can also update their email address via their "My publications" page, or by visiting `/verify`.

A user email address is only updated once successfully verified, so entering a new email here will not reflect on the user account until they have completed the process.

---

## Branching Model

A pull request should be created in draft as soon as the branch is created, with the label `work in progress`. Only once the PR is ready to be reviewed should you change the PR to 'ready for review' on GitHub.

If the PR is reviewed and passes tests/reviews, then it can be merged into `main`.

Anything in the `main` branch is considered to be ready for deployment.

---

## Pull Requests and Reviews

:warning: **All PRs must be approved by at least one developer who is not the developer who created the PR. If the reviewer is a new starter, then a more experienced team member also needs to review the branch.** :warning:

These github-actions workflows run on every push:

### API

-   **API Test Suite (TODO)** The Jest test suite for the API runs and outputs any failures.

### UI

-   **ESLint CI** The ESLint CI Github action runs and ensures the code being checked follows the eslint rules. It will fail if any errors are found.
-   **Prettier CI** The Prettier CI Github actions runs and ensures the code being checked follows the prettier formatting rules. It will fail if any errors are found.
-   **Lighthouse CI** The Lighthouse CI tool runs and if the accessibility score is lower than 95, the action errors and outputs any failures.

All checks will need to pass in order for a PR to be reviewed and merged.

---

## Project Breakdown

### Publications

There are eight publication types:

-   **Research Problem** - a neatly defined scientific problem.
-   **Rationale/Hypothesis** - an original hypothesis relating to an existing published Problem or the rationale for how you think the Problem could be addressed.
-   **Methods** - a practical method of testing an existing published Rationale/Hypothesis.
-   **Results** - raw data or summarised results collected according to an existing published Method (can be linked to a data repository).
-   **Analysis** - a statistical or thematic analysis of existing published Results.
-   **Interpretation** - a discussion around an existing published Analysis.
-   **Real World Application** - real world applications arising from an existing published Interpretation.
-   **Peer Review** - A considered, detailed review of any of the above kinds of publication.

### Links

A **Research Problem** can link to any type of publication.

A **Peer Review** is a review of any type of publication, and so can also link to any type of publication.

All other publication types can only link to the publication type before itself in the chain, for example an **Interpretation** can be linked to an **Analysis**.

---

## Contributing

If you are interested in contributing, please check out [CONTRIBUTING.md](.github/CONTRIBUTING.md) for more information.

Any pull requests from contributors will require a member of the team to review before this can be merged - see [CODEOWNERS](.github/CODEOWNERS).

---

### Team Code Conventions

1. We have chosen to either use npm packages if they provide a default export, or:

```
import * as OutlineIcons from '@heroicons/react/outline';
```

```
import * as Components from '@components';
```

Then this will be referred to in the code as:

```
<OutlineIcons.SparklesIcon>
```

```
<Components.Button>
```

The idea is that it gives all developers on the project an understanding of where methods/functions are coming from when used within large files.

---

## Code of Conduct

Everyone interacting with this codebase should adhere to our [Code of Conduct](.github/CODE-OF-CONDUCT.md).

---

## Licence

Octopus is available under the [GNU General Public License version 3](https://opensource.org/licenses/GPL-3.0).  
See [COPYING](/COPYING) for the full licence text.

---

## Monorepo file structure

```bash
├── 📁 .github
│   ├── 📁 ISSUE_TEMPLATE
│   │   └── 📄 config.yml                          # issue template
│   │
│   ├── 📁 workflows
│   │   ├── 📄 api-tasks.yml                       # github actions for api tasks
│   │   └── 📄 ui-tasks.yml                        # github actions for ui tasks
│   │
│   ├── 📄 CODE-OF-CONDUCT.md                      # project code of conduct
│   ├── 📄 CONTRIBUTING.md                         # project contributing guidelines
│   └── 📄 PULL_REQUEST_TEMPLATE.md                # pull request template
│
├── 📁 api
│   ├── 📁 prisma
│   │   ├── 📁 migrations                          # prisma migration files
│   │   ├── 📁 seeds                               # prisma test and int seed files
│   │   └── 📄 schema.prisma                       # prisma schema
│   │
│   ├── 📁 src
│   │   ├── 📁 components
│   │   ├── 📁 config
│   │   ├── 📁 lib
│   │   ├── 📁 middleware
│   │   └── 📁 utilities
│   │
│   ├── 📄 .gitignore
│   ├── 📄 package.json
│   ├── 📄 serverless.yml
│   └── 📄 README.md                                # api read me
│
├── 📁 infra
│   ├── 📁 create-app                              # terraform project for env infrastructure
│   ├── 📁 modules                                 # terraform modules
│   └── 📄 README.md                               # infra read me
│
├── 📁 ui
│   ├── 📁 public
│   ├── 📁 src
│   ├── 📄 lighthouserc.js                         # lighthouse ci accessibility tool config
│   ├── 📄 tailwind.config.js                      # tailwind config
│   ├── 📄 package.json
│   ├── 📄 .gitignore
│   └── 📄 README.md                               # ui read me
│
│
├── 📄 .gitignore
├── 📄 COPYING                                     # full licence text
├── 📄 docker-compose.yml                          # docker config
└── 📄 README.md                                   # full project read me
```
