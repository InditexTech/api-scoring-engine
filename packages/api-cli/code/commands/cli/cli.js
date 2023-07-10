// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const constants = require("../utils/constants");

const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");

const { verify } = require("./verify");
const { verifyFile } = require("./verify-file");

const startCli = () => {
  let mainDefinitions = [{ name: constants.NAME_COMMAND, defaultOption: true }];
  const mainCommand = commandLineArgs(mainDefinitions, {
    stopAtFirstUnknown: true,
  });
  let argv = mainCommand._unknown || [];

  switch (mainCommand.name) {
    case constants.HELP_COMMAND:
      help();
      break;
    case constants.VERSION_COMMAND:
      console.log(constants.APICLI_VERSION_MESSAGE);
      break;
    case constants.VERIFY_COMMAND:
      verify({ argv });
      break;
    case constants.VERIFY_FILE_COMMAND:
      verifyFile({ argv });
      break;
    default:
      const runOptions = commandLineArgs(constants.MAIN_RUN_DEFINITIONS_COMMANDS, {
        argv,
        stopAtFirstUnknown: true,
      });
      if (!runOptions.help) {
        console.error(
          `${constants.UNRECOGNIZED_OPTION_PREFIX_MESSAGE}${mainCommand.name}${constants.UNRECOGNIZED_OPTION_SUFFIX_MESSAGE}`,
        );
      }
      help();
      break;
  }
};

const help = () => {
  console.log(commandLineUsage(constants.CLI_HELP_SECTIONS));
};

module.exports = {
  startCli,
};
