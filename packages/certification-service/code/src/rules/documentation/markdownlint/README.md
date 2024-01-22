<!--
SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX

SPDX-License-Identifier: Apache-2.0
-->

# Documentation Linting

## About

In this sub-directory you will find the custom rules to be used on the API Scoring.
These are to be used by [markdownlint](https://github.com/DavidAnson/markdownlint)
to evaluate the documentation of Inditex's APIs. This API should be present on
the CI process for all APIs across inditex, as well to be used from local environments

### Main Goal

The objective of this module is to store the base configurations for markdownlint
and also provide an example on how to create a **Readme.md** file that passes
all the applied rules.

### Specifics

- `.markdownlint.json` - Holds the base configurations for the markdownlint\including core rules to be disabled
- `linting-rules/mandatory-sections.js` - Rule for mandatory sections to be included on the `README.md`

## Usage

```sh
markdownlint -r linting-rules/* <README.md path>
```

### Configuration

The customizations for this tool are made on `.markdownlint.json` and
additional rules are added under `linting-rules/mandatory-sections.js`

### Example

Lint the own `README.md` of this tool

```sh
markdownlint -r linting-rules/* README.md
```

## Documentation

- [markdownlint](https://github.com/DavidAnson/markdownlint)
- [markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli)
- [markdownlint for VsCode](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
