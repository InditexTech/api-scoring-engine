const constants = require("../utils/constants");

const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const axios = require("axios");

const refreshRuleset = ({ argv }) => {
  try {
    const runOptions = commandLineArgs(
      constants.REFRESH_RULESET_RUN_DEFINITIONS_COMMANDS,
      {
        argv,
        stopAtFirstUnknown: true,
      }
    );

    if (runOptions.help) {
      showHelp();
      return;
    }

    argv = runOptions._unknown || [];
    const { serviceUrl } = runOptions;

    postRulesetRefresh(serviceUrl);
  } catch (error) {
    console.error(`${constants.ERROR_REFRESH_RULESET_MESSAGE}${error.message}`);
    return;
  }
};

const postRulesetRefresh = (serviceUrl) => {
  const usedUrl = serviceUrl
    ? serviceUrl
    : constants.CERTIFICATION_SERVICE_BASE_URL;
  axios
    .post(usedUrl + constants.CERTIFICATION_SERVICE_RULESETS_REFRESH_ENDPOINT, {
      httpsAgent: constants.HTTPS_AGENT,
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      return console.error(
        constants.ERROR_REFRESH_RULESET_MESSAGE,
        error.response.data.error
      );
    });
};

let showHelp = () => {
  console.log(commandLineUsage(constants.REFRESH_RULESET_HELP_SECTIONS));
};

module.exports = {
  refreshRuleset,
};
