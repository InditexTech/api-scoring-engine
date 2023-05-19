const refreshRuleset = require("../../commands/cli/refresh-ruleset");
const constants = require("../../commands/utils/constants");

const axios = require("axios");
const commandLineUsage = require("command-line-usage");
const util = require("util");

jest.mock("axios");

describe("refresh-ruleset command", () => {
  test("It should show the help for this command", () => {
    console.log = jest.fn();
    const helpText = commandLineUsage(constants.REFRESH_RULESET_HELP_SECTIONS);

    expect(refreshRuleset.refreshRuleset({ argv: ["--help"] })).toBeFalsy();
    expect(console.log).toHaveBeenCalledWith(helpText);
  });

  test("Test refresh ruleset happy path", async () => {
    console.log = jest.fn();

    const refreshRulesetResponse = { data: constants.SUCCESS };

    const refreshRulesetPromise = Promise.resolve(refreshRulesetResponse);

    axios.post.mockImplementation((url) => {
      if (
        url.includes(constants.CERTIFICATION_SERVICE_RULESETS_REFRESH_ENDPOINT)
      ) {
        return refreshRulesetPromise;
      }
    });

    expect(refreshRuleset.refreshRuleset({ argv: [""] })).toBeFalsy();
    await refreshRulesetPromise;
    expect(console.log).toHaveBeenCalledWith(constants.SUCCESS);
  });
});
