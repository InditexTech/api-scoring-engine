// SPDX-FileCopyrightText: 2025 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const graphqlLinterDefaultConfig = require("../../src/rules/grpahql");
const { lintGraphql } = require("../../src/verify/lint");
const { GraphqlLinter } = require("../../src/verify/graphqlLinter");
const { VALIDATION_TYPE_DESIGN } = require("../../src/verify/types");
const { INFO_SEVERITY, ERROR_SEVERITY, WARN_SEVERITY } = require("../../src/evaluate/severity");

jest.mock("../../src/verify/lint");

const mockLintGraphql = lintGraphql;

describe("GraphqlLinter", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    test("should initialize with default configuration", () => {
      const linter = new GraphqlLinter();
      expect(linter.configuration).toStrictEqual(graphqlLinterDefaultConfig);
    });

    test("should override configuration if provided", () => {
      const customConfig = {
        rulesConfig: {
          rules: { "rule-1": "warn", "custom-rules/my-custom-rule": "error" },
          severities: {
            "rule-1": WARN_SEVERITY,
            "custom-rules/my-custom-rule": ERROR_SEVERITY,
          },
        },
        plugins: {
          "custom-rules": {
            rules: {
              "my-custom-rule": () => {},
            },
          },
        },
      };

      const linter = new GraphqlLinter(customConfig);
      expect(linter.configuration.rulesConfig.rules).toStrictEqual(customConfig.rulesConfig.rules);
      expect(linter.configuration.rulesConfig.severities).toStrictEqual(customConfig.rulesConfig.severities);
      expect(linter.configuration.plugins).toStrictEqual(customConfig.plugins);
    });
  });

  describe("lint", () => {
    test("should call lintGraphql and populate design validation issues", async () => {
      const mockValidationType = VALIDATION_TYPE_DESIGN;
      const mockRootFolder = "/mock/root/folder";
      const mockTempDir = "/mock/temp/dir";
      const mockDesign = { designValidation: { validationIssues: [] } };

      const mockLintResult = [
        {
          filePath: "/mock/temp/dir/file1.graphql",
          messages: [
            {
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
            },
            ,
          ],
        },
      ];

      mockLintGraphql.mockResolvedValue(mockLintResult);

      const linter = new GraphqlLinter();
      await linter.lint(mockValidationType, mockRootFolder, mockTempDir, mockDesign);

      expect(mockLintGraphql).toHaveBeenCalledWith(mockRootFolder, graphqlLinterDefaultConfig);
      expect(mockDesign.designValidation.validationIssues).toStrictEqual([
        {
          fileName: "file1.graphql",
          code: "alphabetize",
          message: 'type "Color" should be before type "MasterData"',
          severity: INFO_SEVERITY,
          range: {
            start: { line: 91, character: 6 },
            end: { line: 91, character: 11 },
          },
          path: [],
        },
      ]);
    });

    test("should not lint if validation type is not VALIDATION_TYPE_DESIGN", async () => {
      const mockValidationType = "OTHER_VALIDATION_TYPE";
      const mockRootFolder = "/mock/root/folder";
      const mockTempDir = "/mock/temp/dir";
      const mockDesign = { designValidation: { validationIssues: [] } };

      const linter = new GraphqlLinter();
      await linter.lint(mockValidationType, mockRootFolder, mockTempDir, mockDesign);

      expect(mockLintGraphql).not.toHaveBeenCalled();
      expect(mockDesign.designValidation.validationIssues).toStrictEqual([]);
    });
  });

  describe("numberOfRulesExclidingInfoSeverity", () => {
    test("should return the correct number of rules excluding INFO severity", () => {
      const customConfig = {
        rulesConfig: {
          rules: {
            "rule-1": "error",
            "rule-2": ["warn"],
            "rule-3": "off",
          },
          severities: {
            "rule-1": ERROR_SEVERITY,
            "rule-2": INFO_SEVERITY,
            "rule-3": WARN_SEVERITY,
          },
        },
      };

      const linter = new GraphqlLinter(customConfig);
      const result = linter.numberOfRulesExcludingInfoSeverity;

      expect(result).toBe(1); // Only "rule-1" is not INFO and not "off"
    });
  });
});
