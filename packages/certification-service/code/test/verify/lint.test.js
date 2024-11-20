// SPDX-FileCopyrightText: 2024 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { DocumentationRuleset } = require("../../src/evaluate/documentation/documentationRuleset");
const markdownEvaluate = require("../../src/evaluate/markdownEvaluate");
const { lintFileWithMarkdownLint } = require("../../src/verify/lint");

jest.mock("../../src/evaluate/markdownEvaluate");

describe("Lint Tests", () => {
  describe("lintFileWithMarkdownLint", () => {
    test("Should lint markdown with default", async () => {
      const file = "README.md";
      const ruleset = DocumentationRuleset.API.resolvedRuleset;

      jest.spyOn(markdownEvaluate, "markdownEvaluate").mockResolvedValueOnce(lintResult);

      const result = await lintFileWithMarkdownLint(file, ruleset, undefined);

      expect(result).toStrictEqual(lintResult["README.md"]);
      expect(markdownEvaluate.markdownEvaluate).toHaveBeenCalledWith(file, ruleset, undefined);
    });
    test("Should lint markdown with custom config", async () => {
      const file = "README.md";
      const ruleset = DocumentationRuleset.API.resolvedRuleset;
      const customConfig = {
        default: true,
        extends: null,
        MD013: false,
        MD001: false,
      };

      jest.spyOn(markdownEvaluate, "markdownEvaluate").mockResolvedValueOnce(lintResult);

      const result = await lintFileWithMarkdownLint(file, ruleset, customConfig);

      expect(result).toStrictEqual(lintResult["README.md"]);
      expect(markdownEvaluate.markdownEvaluate).toHaveBeenCalledWith(file, ruleset, customConfig);
    });
  });

  const lintResult = {
    "README.md": [
      {
        lineNumber: 1,
        ruleNames: ["EX_MD050", "custom-mandatory-about"],
        ruleDescription: "Mandatory About Section",
        ruleInformation: null,
        errorDetail: null,
        errorContext: "Section 'about' must exist",
        errorRange: null,
        fixInfo: null,
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
      },
    ],
  };
});
