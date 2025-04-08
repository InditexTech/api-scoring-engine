// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const fs = require("fs");
const path = require("path");
const { getAppLogger } = require("../log");
const { downloadFile } = require("../utils/downloadUtils");
const {
  lintFilesWithProtolint,
  lintFileWithSpectral,
  generateRandomFolder,
  lintGraphqlFile,
} = require("../verify/lint");
const { checkForErrors } = require("../verify/utils");
const { LintRuleset } = require("../evaluate/lint/lintRuleset");
const { API_PROTOCOL } = require("../verify/types");
const { fromSpectralIssue, fromProtlintIssue, fromEslintIssue } = require("../format/issue");
const { isGraphqlFileExtension } = require("../utils/fileUtils");
const graphqlLinterDefaultConfig = require("../rules/graphql");

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
        url.originalFilename?.endsWith(".proto") ||
        isGraphqlFileExtension(url.originalFilename))
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
    let issues = [];
    const tempDir = path.dirname(file);
    switch (apiProtocol) {
      case API_PROTOCOL.REST:
        results = await lintFileWithSpectral({
          file,
          ruleset: LintRuleset.REST_GENERAL.rulesetPath,
        });
        issues = results.map((issue) => fromSpectralIssue(issue, file, tempDir));
        break;
      case API_PROTOCOL.EVENT:
        results = await lintFileWithSpectral({
          file,
          ruleset: LintRuleset.EVENT_GENERAL.rulesetPath,
        });
        issues = results.map((issue) => fromSpectralIssue(issue, file, tempDir));
        break;
      case API_PROTOCOL.GRPC:
        const protolintResults = await lintFilesWithProtolint(file, new Map());
        results = formatProtolintIssues(protolintResults);
        issues = protolintResults.map((issue) => fromProtlintIssue(issue, file, tempDir));
        break;
      case API_PROTOCOL.GRAPHQL:
        const result = await lintGraphqlFile(file, graphqlLinterDefaultConfig);
        result.forEach((element) => {
          element.messages.forEach((message) => issues.push(fromEslintIssue(message, element.filePath, tempDir)));
        });
        results = issues.map((issue) => ({
          fileName,
          code: issue.code,
          message: issue.message,
          severity: issue.severity,
          source: fileName,
          range: issue.range,
          path: issue.path,
        }));
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
      issues: issues.map((issue) => ({ ...issue, fileName: fileName })),
    };
    result.hasErrors = checkForErrors(result, results);

    return result;
  } finally {
    if (file) {
      fs.unlink(file, (err) => err && logger.error(err.message, `FILE ${file}`));
    }
    if (auxFile) {
      fs.unlink(auxFile, (err) => err && logger.error(err.message, `AUXFILE ${auxFile}`));
    }
    if (folderPath) {
      fs.rm(folderPath, { recursive: true }, (err) => err && logger.error(err.message, `FOLDER ${folderPath}`));
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
