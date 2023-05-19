const fs = require("fs");
const path = require("path");
const { getAppLogger } = require("../log");
const { downloadFile } = require("../utils/downloadUtils");
const { lintFilesWithProtolint, lintFileWithSpectral, generateRandomFolder } = require("../verify/lint");
const { checkForErrors } = require("../verify/utils");
const { LintRuleset } = require("../evaluate/lint/lintRuleset");

const logger = getAppLogger();
module.exports.execute = async (url, apiProtocol) => {
  let file = null;
  let auxFile = null;
  let folderPath = generateRandomFolder();
  let fileName;
  try {
    if (
      url &&
      (url.mimetype === "text/yaml" ||
        url.mimetype === "application/json" ||
        (url.originalFilename && url.originalFilename.endsWith(".proto")))
    ) {
      fs.copyFileSync(url.filepath, `${url.filepath}_${url.originalFilename}`);
      logger.info(`Received file ${url.originalFilename}`);
      auxFile = url.filepath;
      file = `${url.filepath}_${url.originalFilename}`;
      fileName = url.originalFilename;
    } else {
      fileName = url.split("/").pop().split("?").shift();
      file = path.join(folderPath, fileName);
      logger.info(`Downloading ${url} to ${file}`);
      await downloadFile(url, file);
    }

    let results;
    switch (apiProtocol) {
      case 1:
        results = await lintFileWithSpectral({
          file,
          ruleset: LintRuleset.REST_GENERAL.rulesetPath,
        });
        break;
      case 2:
        results = await lintFileWithSpectral({
          file,
          ruleset: LintRuleset.EVENT_GENERAL.rulesetPath,
        });
        break;
      case 3:
        const protolintResults = await lintFilesWithProtolint(file, new Map());
        results = formatProtolintIssues(protolintResults);
        break;
      default:
        break;
    }

    results.forEach((issue) => {
      issue.source = fileName;
    });

    let result = {
      hasErrors: false,
      results,
    };
    result.hasErrors = checkForErrors(result, results);

    return result;
  } finally {
    if (file) {
      fs.unlink(file, (err) => err && logger.error(err.message));
    }
    if (auxFile) {
      fs.unlink(auxFile, (err) => err && logger.error(err.message));
    }
    if (folderPath) {
      fs.rmdir(folderPath, (err) => err && logger.error(err.message));
    }
  }
};

const formatProtolintIssues = (issues) => {
  return issues.map((issue) => {
    return {
      code: issue.rule,
      message: issue.message,
      severity: issue.severity,
      source: issue.fileName,
      path: [],
      range: {
        start: { line: issue.line, character: issue.column },
        end: { line: issue.line, character: issue.column },
      },
    };
  });
};
