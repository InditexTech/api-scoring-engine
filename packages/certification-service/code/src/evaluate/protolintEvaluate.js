// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { configValue } = require("../config/config");
const { formatProtolint } = require("../format/protolintFormatter");
const path = require("path");
const { execFile } = require("child_process");
const { getAppLogger } = require("../log");

const logger = getAppLogger();

const evaluateProtoLint = async (files, customFlags) => {
  const configDirectory = path.join(process.cwd(), configValue("cerws.lint.grpc.configuration-directory"));
  const protolintBin = path.join(process.cwd(), configValue("cerws.lint.grpc.protolint-bin-path"));
  const protolintPluginBin = path.join(process.cwd(), configValue("cerws.lint.grpc.protolint-custom-rules-bin-path"));

  const customFlagsFormatted = formatFlags(customFlags);
  const fileArguments = formatFileArguments(files);
  const rawData = await execProtolint(protolintBin, [
    "-plugin",
    protolintPluginBin,
    ...customFlagsFormatted,
    `-config_dir_path=${configDirectory}`,
    "--reporter=json",
    ...fileArguments,
  ]);

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
  if (!(customFlags instanceof Map)) {
    return [];
  }

  return Array.from(customFlags.entries())
    .map(([key, value]) => `-${key}=${value}`)
    .filter((flag) => flag.length > 2);
};

const formatFileArguments = (files) => {
  if (Array.isArray(files)) {
    return files.map((file) => String(file));
  }

  return [String(files)];
};

const execProtolint = (binaryPath, args) => {
  return new Promise((resolve) => {
    execFile(binaryPath, args, (error, stdout, stderr) => {
      resolve(stdout ? stdout : stderr);
    });
  });
};

module.exports = evaluateProtoLint;
