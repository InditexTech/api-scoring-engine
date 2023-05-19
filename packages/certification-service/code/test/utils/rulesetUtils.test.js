const { setUpHttpServer } = require("../setup");
const { updateRulesRepository } = require("../../src/utils/rulesetUtils");
let server = null;

const markdownlintContents = {
  default: true,
  extends: null,
  MD013: false,
  severities: [
    {
      id: "MD025",
      severity: 1,
    },
  ],
};

jest.mock("markdownlint", () => {
  const originalModule = jest.requireActual("markdownlint");

  return {
    __esModule: true,
    ...originalModule,
    readConfigSync: jest
      .fn()
      .mockImplementationOnce(() => markdownlintContents)
      .mockImplementationOnce(() => undefined),
  };
});

describe("Tests Ruleset Utils", () => {
  beforeAll(async () => {
    server = await setUpHttpServer();
  });

  afterAll(() => {
    server.close();
  });

  test("updateRulesRepository no issues", async () => {
    const evaluationResult = await updateRulesRepository();
    expect(evaluationResult).toBe(true);
  });
});
