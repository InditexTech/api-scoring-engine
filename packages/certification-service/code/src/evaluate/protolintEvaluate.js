// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { configValue } = require("../config/config");
const { formatProtolint } = require("../format/protolintFormatter");
const path = require("path");
const { getAppLogger } = require("../log");

const logger = getAppLogger();

const evaluateProtoLint = async (files, customFlags) => {
  const configDirectory = path.join(process.cwd(), configValue("cerws.lint.grpc.configuration-directory"));
  const protolintBin = path.join(process.cwd(), configValue("cerws.lint.grpc.protolint-bin-path"));
  const protolintPluginBin = path.join(process.cwd(), configValue("cerws.lint.grpc.protolint-custom-rules-bin-path"));

  const customFlagsFormatted = formatFlags(customFlags);

  const rawData = await execShellCommand(
    `${protolintBin} -plugin  ${protolintPluginBin} ${customFlagsFormatted} -config_dir_path=${configDirectory} --reporter=json ${files}`,
  );

  let data;
  try {
    data = formatProtolint(rawData);
  } catch (e) {
    logger.error(e.message);
    data = [
      {
        line: 0,
        column: 0,
        message: e.message,
        rule: "PROTOLINT_FAILED",
        fileName: files,
        severity: 0,
      },
    ];
  }
  return data;
};

const formatFlags = (customFlags) => {
  return Array.from(customFlags.entries())
    .map(([key, value]) => `-${key}=${value}`)
    .join(" ");
};

const execShellCommand = (cmd) => {
  const exec = require("child_process").exec;
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      resolve(stdout ? stdout : stderr);
    });
  });
};

module.exports = evaluateProtoLint;
