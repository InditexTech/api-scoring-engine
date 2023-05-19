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

const lintFileWithMarkdownLint = async (file, ruleset) => {
  logger.info(`Linting md file ${file} with ruleset ${ruleset}`);
  return Object.values(await markdownEvaluate(file, ruleset))[0];
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
