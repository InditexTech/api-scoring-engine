const controller = require("../../src/controllers/ruleset-controller");
jest.mock("../../src/utils/rulesetUtils", () => {
  const originalModule = jest.requireActual("../../src/utils/rulesetUtils");

  return {
    __esModule: true,
    ...originalModule,
    updateRulesRepository: () => undefined,
  };
});

describe("Tests Ruleset Controller", () => {
  test("updateRulesRepository", async () => {
    const ctx = { state: {} };
    let next = jest.fn();
    await controller.refreshRulesets(ctx, next);
    expect(ctx.body).toBe("Failure");
  });
});
