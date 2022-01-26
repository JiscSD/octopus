<img src="https://www.jisc.ac.uk/sites/all/themes/jisc_clean/img/jisc-logo.svg" align="right" width=50 height=50/><h1 align="left">Octopus</h1>

-badges required-

---

## Octopus Project Overview

---

**Octopus. The primary research record.**  
A new way to publish your scientific work that's fast, free and fair.  
Designed to replace journals and papers as the place to establish priority and record your work in full detail, Octopus is free to use and publishes all kinds of scientific work, whether it is a hypothesis, a method, data, an analysis or a peer review.  
Publication is instant. Peer review happens openly. All work can be reviewed and rated.
Your personal page records everything you do and how it is rated by your peers.
Octopus encourages meritocracy, collaboration and a fast and effective scientific process.

---

## Monorepo file structure

---

```bash
├── 📁 .github
│   ├── 📁 ISSUE_TEMPLATE
│   │   └── 📄 config.yml                          # issue template config
│   ├── 📁 workflows
│   │   ├── 📄 api-testing.yml                     # github actions for api testing
│   │   └── 📄 ui-testing.yml                      # github actions for ui testing
│   ├── 📄 CODE-OF-CONDUCT.md                      # project code of conduct
│   ├── 📄 CONTRIBUTING.md                         # project contributing list
│   └── 📄 PULL_REQUEST_TEMPLATE.md                # pull request template
│
├── 📁 infra
│   ├── 📁 create-app                              # terraform project for env infrastructure
│   ├── 📁 create-cicd                             # terraform project for aws codebuild (ran once)
│   ├── 📁 create-pipeline                         # buildspec files
│   ├── 📁 modules                                 # terraform modules
│   └── 📄 README.md                               # infra read me
│
├── 📄 .gitignore                                  # git ignored files
└── 📄 README.md                                   # full project read me
```

---

## Branching and Pull requests

---

A pull request should be created as soon as the branch is created, with the label `work in progress`. Only once the PR is ready to be reviewed should you request a review on GitHub.

If the PR is reviewed and passes tests/reviews, then it can be merged into `main`.

Anything in the `main` branch is considered to be ready for deployment.

:warning: **All PRs must be approved by at least one developer who is not the developer who created the PR. If the reviewer is a new starter, then a more experienced team member also needs to review the branch.** :warning:

Github workflows:

---

## Project Breakdown

---

### Publications

### Links

---

## Entity Relationship Diagram (ERD)

---

---

## Contributing

---

If you are interested in contributing, please check out [CONTRIBUTING.md](.github/CONTRIBUTING.md) for more information.

---

## Code of Conduct

---

Everyone interacting with this codebase should adhere to our [Code of Conduct](.github/CODE-OF-CONDUCT.md).

---

## License

---

Octopus is available under the
[MIT license](https://opensource.org/licenses/MIT). the [APACHE 2.0 license](https://opensource.org/licenses/Apache-2.0). See
[LICENSE](https://github.com/JiscSD/octopus/LICENSE) for the full
license text.
