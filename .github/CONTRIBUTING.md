# Welcome

Welcome! :tada::sparkles: and thank you for taking the time to contribute to this project.

Please take a moment to read through this document in order to make the contribution process as straightforward as possible.

If you want to ask a question, please head on over to the project discussion area on Github: [Octopus Github discussions](https://github.com/Jisc/octopus/discussions).

Please adhere to our [Code of Conduct](CODE-OF-CONDUCT.md) when contributing to this repository.

---

## Contents

---

- [Report a bug by creating an issue](#report-a-bug-by-creating-an-issue)
- [Suggest an enhancement by posting in the ideas section](#suggest-an-enhancement-by-posting-in-the-ideas-section)
- [Submit changes by creating a PR](#submit-changes-by-creating-a-pr)

---

## Report a bug by creating an issue

---

If you spot a :bug: bug :bug: then feel free to [open an issue](https://github.com/Jisc/octopus/issues).

A helpful bug report should include:

- the exact steps to reproduce the bug
- the actual behaviour
- the expected behaviour
- screenshot of the unexpected behaviour, if possible

---

## Suggest an enhancement by posting in the ideas section

---

If you have an :bulb: idea :bulb: for an enhancement or feature then feel free to [post an idea](https://github.com/Jisc/octopus/discussions/categories/ideas).

When posting, select the category as `Ideas` and then add a title and some content.

---

## Submit changes by creating a PR

---

If you would like to submit any changes and contribute some code, please:

1. fork this repository
2. create a new branch
3. make changes
4. commit/push your new branch
5. [submit a PR for review](https://github.com/Jisc/octopus/pulls)

A draft pull request should be created as soon as the branch is created, with the label `work in progress`. Only once the PR is ready to be reviewed should you request a review on GitHub.  
We use Pull request labels to specify when changes are made to the `UI`, the `API`, or `Documentation`.

Any pull requests from contributors will require a member of the team to review before this can be merged - see [CODEOWNERS](../.github/CODEOWNERS).

**Prerequisites and local setup**

- Install [Node.js](https://github.com/nodejs/node) `v20`
  - Recommended: use [`nvm`](https://github.com/nvm-sh/nvm) for managing Node.js versions

Follow our documentation on locally setting up [the UI](../ui/README.md#local-setup) and [the API](../api/README.md#local-setup).

**Code styleguide**

Both our `UI` and `API` use individual configurations of [ESLint](https://eslint.org) and [Prettier](https://prettier.io) to enforce coding styles.

### Team Code Conventions

1. We have chosen to either use npm packages if they provide a default export, or:

```
import * as OutlineIcons from '@heroicons/react/24/outline';
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
