// SPDX-FileCopyrightText: 2024 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const path = require("path");
const { DocumentationLinter } = require("../../src/verify/documentationLinter");
const { VALIDATION_TYPE_DOCUMENTATION } = require("../../src/verify/types");
const { DocumentationRuleset } = require("../../src/evaluate/documentation/documentationRuleset");
const linter = require("../../src/verify/lint");

jest.mock("../../src/verify/lint");

describe("Documentation Linter tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should lint with default config", async () => {
    const documentation = { documentationValidation: { validationType: VALIDATION_TYPE_DOCUMENTATION, issues: [] } };
    const customConfig = {
      default: true,
      extends: null,
      MD013: false,
      MD001: false,
    };

    jest.spyOn(linter, "lintFileWithMarkdownLint").mockResolvedValueOnce(issues);

    await DocumentationLinter.lintDocumentation(
      VALIDATION_TYPE_DOCUMENTATION,
      path.join(__dirname, "../data/"),
      { "definition-path": "" },
      documentation,
      undefined,
    );

    expect(linter.lintFileWithMarkdownLint).toHaveBeenCalledWith(
      path.join(__dirname, "../data/README.md"),
      DocumentationRuleset.API.resolvedRuleset,
      undefined,
    );

    expect(documentation.documentationValidation.issues).toEqual(issues);
  });

  test("Should lint with custom config", async () => {
    const documentation = { documentationValidation: { validationType: VALIDATION_TYPE_DOCUMENTATION, issues: [] } };
    const customConfig = {
      default: true,
      extends: null,
      MD013: false,
      MD001: false,
    };

    jest.spyOn(linter, "lintFileWithMarkdownLint").mockResolvedValueOnce(issues);

    await DocumentationLinter.lintDocumentation(
      undefined,
      path.join(__dirname, "../data/"),
      { "definition-path": "" },
      documentation,
      customConfig,
    );

    expect(linter.lintFileWithMarkdownLint).toHaveBeenCalledWith(
      path.join(__dirname, "../data/README.md"),
      DocumentationRuleset.API.resolvedRuleset,
      customConfig,
    );

    expect(documentation.documentationValidation.issues).toStrictEqual(issues);
  });

  const issues = [
    {
      lineNumber: 1,
      ruleNames: ["EX_MD050", "custom-mandatory-about"],
      ruleDescription: "Mandatory About Section",
      ruleInformation: null,
      errorDetail: null,
      errorContext: "Section 'about' must exist",
      errorRange: null,
      fixInfo: null,
      severity: 1,
      fileName: "README.md",
    },
    {
      lineNumber: 7,
      ruleNames: ["MD022", "blanks-around-headings"],
      ruleDescription: "Headings should be surrounded by blank lines",
      ruleInformation: "https://github.com/DavidAnson/markdownlint/blob/v0.34.0/doc/md022.md",
      errorDetail: "Expected: 1; Actual: 0; Below",
      errorContext: "# Title",
      errorRange: null,
      fixInfo: {
        lineNumber: 8,
        insertText: "\n",
      },
      severity: 1,
      fileName: "README.md",
    },
    {
      lineNumber: 14,
      ruleNames: ["MD047", "single-trailing-newline"],
      ruleDescription: "Files should end with a single newline character",
      ruleInformation: "https://github.com/DavidAnson/markdownlint/blob/v0.34.0/doc/md047.md",
      errorDetail: null,
      errorContext: null,
      errorRange: [267, 1],
      fixInfo: {
        editColumn: 268,
        insertText: "\n",
      },
      severity: 1,
      fileName: "README.md",
    },
  ];
});
