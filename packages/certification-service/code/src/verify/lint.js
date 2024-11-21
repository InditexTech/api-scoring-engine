// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { evaluate } = require("../evaluate/spectralEvaluate");
const evaluateProtolint = require("../evaluate/protolintEvaluate");
const { markdownEvaluate } = require("../evaluate/markdownEvaluate");
const { mkdirSync } = require("fs");
const os = require("os");
const path = require("path");
const hexoid = require("hexoid");

const { getAppLogger } = require("../log");

const toHexoId = hexoid(48);

const logger = getAppLogger();

const lintFileWithSpectral = async ({ file, ruleset }) => {
  return evaluate(ruleset, file);
};

const lintFilesWithProtolint = async (files, customFlags) => {
  return evaluateProtolint(files, customFlags);
};

const lintFileWithMarkdownLint = async (file, ruleset, customConfig) => {
  logger.info(`Linting md file ${file} with ruleset ${ruleset}`);
  return Object.values(await markdownEvaluate(file, ruleset, customConfig))[0];
};

const generateRandomFolder = () => {
  const folderName = toHexoId();
  const fullPath = path.join(os.tmpdir(), folderName);

  mkdirSync(fullPath);

  return fullPath;
};

module.exports = {
  lintFileWithSpectral,
  lintFilesWithProtolint,
  lintFileWithMarkdownLint,
  generateRandomFolder,
};
