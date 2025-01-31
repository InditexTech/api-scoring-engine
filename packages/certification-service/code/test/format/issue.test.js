// SPDX-FileCopyrightText: 2025 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { INFO_SEVERITY } = require("../../src/evaluate/severity");
const {
  fromSpectralIssue,
  fromProtlintIssue,
  fromMarkdownlintIssue,
  fromEslintIssue,
} = require("../../src/format/issue");

describe("Issue Conversion Functions", () => {
  test("fromSpectralIssue should convert an issue", () => {
    const issue = {
      code: "contact-email",
      message: "Definition must have a contact email",
      path: ["info"],
      severity: 1,
      source: "/temp/file.yaml",
      range: {
        start: {
          line: 1,
          character: 5,
        },
        end: {
          line: 6,
          character: 16,
        },
      },
      fileName: "/temp/file.yaml",
    };
    const result = fromSpectralIssue(issue, "/temp/file.yaml", "/temp");
    expect(result).toStrictEqual({
      fileName: "file.yaml",
      code: "contact-email",
      message: "Definition must have a contact email",
      severity: "WARN",
      range: issue.range,
      path: issue.path,
    });
  });

  test("fromProtlintIssue should convert an issue", () => {
    const issue = {
      column: 2,
      fileName: "../../../../../temp/proto.proto",
      line: 125,
      rule: "ENUM_NAMES_LOWER_SNAKE_CASE",
      message: 'Enum name "Brand" must be underscore_separated_names',
      severity: 1,
    };
    const result = fromProtlintIssue(issue, "/temp/proto.proto", "/temp/");
    expect(result).toStrictEqual({
      fileName: "proto.proto",
      code: "ENUM_NAMES_LOWER_SNAKE_CASE",
      message: 'Enum name "Brand" must be underscore_separated_names',
      severity: "WARN",
      range: {
        start: { line: 125, character: 2 },
        end: { line: 125, character: 2 },
      },
      path: [],
    });
  });

  test("fromMarkdownlintIssue should convert an issue", () => {
    const issue = {
      lineNumber: 3,
      ruleNames: ["MD012", "no-multiple-blanks"],
      ruleDescription: "Multiple consecutive blank lines",
      ruleInformation: "https://github.com/DavidAnson/markdownlint/blob/v0.34.0/doc/md012.md",
      errorDetail: "Expected: 1; Actual: 2",
      errorContext: null,
      errorRange: null,
      fixInfo: {
        deleteCount: -1,
      },
      severity: 1,
      fileName: "test/README.md",
    };
    const result = fromMarkdownlintIssue(issue);
    expect(result).toStrictEqual({
      fileName: "test/README.md",
      code: "MD012, no-multiple-blanks",
      message: "Multiple consecutive blank lines",
      severity: "WARN",
      range: {
        start: { line: 3, character: 1 },
        end: { line: 3, character: 1 },
      },
      path: [],
      ruleInformation: "https://github.com/DavidAnson/markdownlint/blob/v0.34.0/doc/md012.md",
    });
  });

  test("fromEslintIssue should convert an issue", () => {
    const issue = {
      ruleId: "@graphql-eslint/alphabetize",
      severity: 2,
      message: 'type "Color" should be before type "MasterData"',
      line: 91,
      column: 6,
      nodeType: "Name",
      messageId: "alphabetize",
      endLine: 91,
      endColumn: 11,
      fix: {
        range: [1304, 1521],
        text: "",
      },
      customSeverity: INFO_SEVERITY,
    };
    const result = fromEslintIssue(issue, "/temp/schema.graphqls", "/temp");
    expect(result).toStrictEqual({
      fileName: "schema.graphqls",
      code: "alphabetize",
      message: 'type "Color" should be before type "MasterData"',
      severity: "INFO",
      range: {
        start: { line: 91, character: 6 },
        end: { line: 91, character: 11 },
      },
      path: [],
    });
  });

  test("fromEslintIssue should convert an issue without messageId", () => {
    const issue = {
      ruleId: "custom-rules/my-custom-rule",
      severity: 2,
      message: "The field `Query.executeExampleMethod` has no valid name!",
      line: 7,
      column: 3,
      nodeType: "FieldDefinition",
      endLine: 16,
      endColumn: 20,
      customSeverity: 2,
    };
    const result = fromEslintIssue(issue, "/temp/schema.graphql", "/temp/");
    expect(result).toStrictEqual({
      fileName: "schema.graphql",
      code: "custom-rules/my-custom-rule",
      message: "The field `Query.executeExampleMethod` has no valid name!",
      severity: "INFO",
      range: {
        start: { line: 7, character: 3 },
        end: { line: 16, character: 20 },
      },
      path: [],
    });
  });
});
