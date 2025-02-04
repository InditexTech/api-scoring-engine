const { lintGraphql, lintGraphqlFile } = require("../../src/verify/lint");
const { evaluateGraphqlApi, evaluateGraphqlFile } = require("../../src/evaluate/graphqlEvaluate");
const { WARN_SEVERITY } = require("../../src/evaluate/severity");

jest.mock("../../src/evaluate/graphqlEvaluate", () => ({
  evaluateGraphqlApi: jest.fn(),
  evaluateGraphqlFile: jest.fn(),
}));

describe("GraphQL Linter", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GraphQL Linter", () => {
    const graphqlLinterExpectedResult = [
      {
        filePath: "/test/folder/schema.graphql",
        messages: [
          {
            ruleId: "@graphql-eslint/require-description",
            severity: 2,
            message: 'Description is required for input "Article"',
            line: 41,
            column: 7,
            nodeType: null,
            messageId: "require-description",
            endLine: 41,
            endColumn: 14,
            customSeverity: 1,
          },
        ],
        suppressedMessages: [],
        errorCount: 12,
        fatalErrorCount: 0,
        warningCount: 0,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        source: "",
        usedDeprecatedRules: [],
      },
    ];

    const linterConfig = {
      plugins: {},
      rulesConfig: {
        rules: {
          "@graphql-eslint/require-description": "error",
        },
        severities: {
          "@graphql-eslint/require-description": WARN_SEVERITY,
        },
      },
    };
    test("lintGraphql should call evaluateGraphqlApi without config", async () => {
      evaluateGraphqlApi.mockResolvedValue(graphqlLinterExpectedResult);

      const result = await lintGraphql("/test/folder");

      expect(evaluateGraphqlApi).toHaveBeenCalledWith("/test/folder", {});
      expect(result).toStrictEqual(graphqlLinterExpectedResult);
    });

    test("lintGraphql should call evaluateGraphqlApi with config", async () => {
      evaluateGraphqlApi.mockResolvedValue(graphqlLinterExpectedResult);

      const result = await lintGraphql("/test/folder", linterConfig);

      expect(evaluateGraphqlApi).toHaveBeenCalledWith("/test/folder", linterConfig);
      expect(result).toStrictEqual(graphqlLinterExpectedResult);
    });

    test("lintGraphqlFile should call evaluateGraphqlFile without config", async () => {
      evaluateGraphqlFile.mockResolvedValue(graphqlLinterExpectedResult);

      const result = await lintGraphqlFile("/test/folder/schema.graphql");

      expect(evaluateGraphqlFile).toHaveBeenCalledWith("/test/folder/schema.graphql", {});
      expect(result).toStrictEqual(graphqlLinterExpectedResult);
    });
    test("lintGraphqlFile should call evaluateGraphqlFile with config", async () => {
      evaluateGraphqlFile.mockResolvedValue(graphqlLinterExpectedResult);

      const result = await lintGraphqlFile("/test/folder/schema.graphql", linterConfig);

      expect(evaluateGraphqlFile).toHaveBeenCalledWith("/test/folder/schema.graphql", linterConfig);
      expect(result).toStrictEqual(graphqlLinterExpectedResult);
    });
  });
});
