// SPDX-FileCopyrightText: 2025 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { evaluateGraphqlApi, evaluateGraphqlFile } = require("../../src/evaluate/graphqlEvaluate");
const { ESLint } = require("eslint");
const graphqlPlugin = require("@graphql-eslint/eslint-plugin");
const path = require("path");
const { WARN_SEVERITY, INFO_SEVERITY, ERROR_SEVERITY } = require("../../src/evaluate/severity");
const { getAppLogger } = require("../../src/log");

jest.mock("eslint");
jest.mock("@graphql-eslint/eslint-plugin");
jest.mock("../../src/log");

describe("graphqlEvaluate", () => {
  const mockLog = { error: jest.fn() };

  beforeEach(() => {
    getAppLogger.mockReturnValue(mockLog);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("evaluateGraphqlApi", () => {
    test("should run ESLint for repository", async () => {
      const mockLintFiles = jest.fn().mockResolvedValue([]);

      ESLint.mockImplementation(() => ({
        lintFiles: mockLintFiles,
      }));

      const mockRootFolder = "/mock/root/folder";
      const mockConfig = {};

      const result = await evaluateGraphqlApi(mockRootFolder, mockConfig);

      expect(ESLint).toHaveBeenCalledWith({
        overrideConfigFile: true,
        allowInlineConfig: false,
        errorOnUnmatchedPattern: false,
        cwd: mockRootFolder,
        baseConfig: {
          files: ["**/*.graphql", "**/*.graphqls", "**/*.gql"],
          languageOptions: {
            parser: graphqlPlugin.parser,
            parserOptions: {
              graphQLConfig: { schema: `${mockRootFolder}/**/*.{graphql,graphqls,gql}` },
            },
          },
          plugins: {
            "@graphql-eslint": graphqlPlugin,
          },
          rules: graphqlPlugin.configs["flat/schema-recommended"].rules,
        },
      });

      expect(mockLintFiles).toHaveBeenCalledWith([
        `${mockRootFolder}/**/*.graphql`,
        `${mockRootFolder}/**/*.graphqls`,
        `${mockRootFolder}/**/*.gql`,
      ]);
      expect(result).toStrictEqual([]);
    });

    test("should configure ESLint and return linting results", async () => {
      const mockResult = {
        filePath: "/mock/root/folder/schema.graphqls",
        messages: [
          {
            ruleId: "@graphql-eslint/require-description",
            severity: 1,
            message: 'Description is required for input "Article"',
            line: 41,
            column: 7,
            nodeType: null,
            messageId: "require-description",
            endLine: 41,
            endColumn: 14,
          },
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
          },
        ],
        suppressedMessages: [],
        errorCount: 2,
        fatalErrorCount: 0,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        source: "",
        usedDeprecatedRules: [],
      };
      const mockLintFiles = jest.fn().mockResolvedValue([mockResult]);

      ESLint.mockImplementation(() => ({
        lintFiles: mockLintFiles,
      }));

      const mockRootFolder = "/mock/root/folder";
      const mockConfig = {
        plugins: { "@graphql-eslint": graphqlPlugin },
        rulesConfig: {
          rules: {
            "@graphql-eslint/require-description": "error",
            "@graphql-eslint/alphabetize": "error",
            "@graphql-eslint/strict-id-in-types": [
              "off",
              { acceptedIdNames: ["id", "_id"], acceptedIdTypes: ["ID", "Int"] },
            ],
          },
          severities: {
            "@graphql-eslint/require-description": INFO_SEVERITY,
            "@graphql-eslint/strict-id-in-types": WARN_SEVERITY,
          },
        },
      };

      const mockFiles = [
        "/mock/root/folder/**/*.graphql",
        "/mock/root/folder/**/*.graphqls",
        "/mock/root/folder/**/*.gql",
      ];
      const result = await evaluateGraphqlApi(mockRootFolder, mockConfig);

      expect(ESLint).toHaveBeenCalledWith({
        overrideConfigFile: true,
        allowInlineConfig: false,
        errorOnUnmatchedPattern: false,
        cwd: mockRootFolder,
        baseConfig: {
          files: ["**/*.graphql", "**/*.graphqls", "**/*.gql"],
          languageOptions: {
            parser: graphqlPlugin.parser,
            parserOptions: {
              graphQLConfig: { schema: `${mockRootFolder}/**/*.{graphql,graphqls,gql}` },
            },
          },
          plugins: mockConfig.plugins,
          rules: mockConfig.rulesConfig.rules,
        },
      });

      expect(mockLintFiles).toHaveBeenCalledWith(mockFiles);
      expect(result).toStrictEqual([
        {
          filePath: "/mock/root/folder/schema.graphqls",
          messages: [
            {
              ruleId: "@graphql-eslint/require-description",
              severity: 1,
              message: 'Description is required for input "Article"',
              line: 41,
              column: 7,
              nodeType: null,
              messageId: "require-description",
              endLine: 41,
              endColumn: 14,
              customSeverity: INFO_SEVERITY,
            },
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
              customSeverity: ERROR_SEVERITY,
            },
          ],
          suppressedMessages: [],
          errorCount: 2,
          fatalErrorCount: 0,
          warningCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0,
          source: "",
          usedDeprecatedRules: [],
        },
      ]);
    });
  });

  describe("evaluateGraphqlFile", () => {
    test("should run ESLint for single file", async () => {
      const mockLintFiles = jest.fn().mockResolvedValue([]);

      ESLint.mockImplementation(() => ({
        lintFiles: mockLintFiles,
      }));

      const mockFile = "/mock/root/folder/file.graphql";
      const mockConfig = {
        plugins: {},
        rulesConfig: {},
      };

      const result = await evaluateGraphqlFile(mockFile, mockConfig);

      expect(ESLint).toHaveBeenCalledWith({
        overrideConfigFile: true,
        allowInlineConfig: false,
        errorOnUnmatchedPattern: false,
        cwd: path.dirname(mockFile),
        baseConfig: {
          files: ["**/*.graphql", "**/*.graphqls", "**/*.gql"],
          languageOptions: {
            parser: graphqlPlugin.parser,
            parserOptions: {
              graphQLConfig: { schema: mockFile },
            },
          },
          plugins: {
            "@graphql-eslint": graphqlPlugin,
          },
          rules: graphqlPlugin.configs["flat/schema-recommended"].rules,
        },
      });

      expect(mockLintFiles).toHaveBeenCalledWith([mockFile]);
      expect(result).toStrictEqual([]);
    });
  });
});
