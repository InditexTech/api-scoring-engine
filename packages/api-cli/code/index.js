#!/usr/bin/env node

// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

process.env["NODE_CONFIG_DIR"] = __dirname + "/../config/";

const constants = require("./commands/utils/constants");

const figlet = require("figlet");
const chalk = require("chalk");

if (process.argv.length === 2) {
  console.log(
    chalk.greenBright(
      figlet.textSync(constants.APICLI_MESSAGE, {
        horizontalLayout: constants.FIGLET_HORIZONTAL_LAYOUT_FULL,
      })
    )
  );
  console.log(constants.VERSION_MESSAGE);
} else if (process.argv.length > 2) {
  const { startCli } = require("./commands/cli/cli");
  startCli();
} else {
  console.error(constants.INVALID_NUMBER_ARGUMENTS_MESSAGE);
  console.log(process.argv);
}
