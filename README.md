<img src="https://www.jisc.ac.uk/sites/all/themes/jisc_clean/img/jisc-logo.svg" align="right" width=50 height=50/><h1 align="left">Octopus</h1>

-badges required-

### Overview

&nbsp;

### Monorepo file structure

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

&nbsp;

### Database schemas

&nbsp;

### Additional

&nbsp;

### Useful links

## Contributing

If you are interested in contributing, please check out [CONTRIBUTING.md](.github/CONTRIBUTING.md) for more information.

## Code of Conduct

Everyone interacting with this codebase should adhere to our [Code of Conduct](.github/CODE-OF-CONDUCT.md).

## License

Octopus is available under the
[MIT license](https://opensource.org/licenses/MIT). the [APACHE 2.0 license](https://opensource.org/licenses/Apache-2.0). See
[LICENSE](https://github.com/JiscSD/octopus/LICENSE) for the full
license text.
