// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { LintRuleset } = require("../evaluate/lint/lintRuleset");
const { lintFileWithSpectral } = require("./lint");
const { VALIDATION_TYPE_DESIGN, VALIDATION_TYPE_SECURITY } = require("./types");
const { checkForErrors, cleanFileName } = require("./utils");

class RestLinter {
  static async lintRest({ validationType, file, fileName, rootFolder, apiValidation, design, security, tempFolder }) {
    if (!validationType || validationType === VALIDATION_TYPE_DESIGN) {
      const issues = await lintFileWithSpectral({
        file,
        ruleset: this.resolveGeneralRuleset().rulesetPath,
      });
      addFileNameToIssues(issues, fileName, rootFolder, tempFolder);
      apiValidation.hasErrors = checkForErrors(apiValidation, issues);
      issues.forEach((issue) => (issue.source = issue.fileName));
      design.designValidation.spectralValidation.issues.push(...issues);
    }
    if (!validationType || validationType === VALIDATION_TYPE_SECURITY) {
      const issues = await lintFileWithSpectral({
        file,
        ruleset: this.resolveSecurityRuleset().rulesetPath,
      });

      addFileNameToIssues(issues, fileName, rootFolder, tempFolder);
      apiValidation.hasErrors = checkForErrors(apiValidation, issues);
      issues.forEach((issue) => (issue.source = issue.fileName));
      security.securityValidation.spectralValidation.issues.push(...issues);
    }
  }

  static resolveGeneralRuleset() {
    return LintRuleset.REST_GENERAL;
  }

  static resolveSecurityRuleset() {
    return LintRuleset.REST_SECURITY;
  }
}

const addFileNameToIssues = (issues, fileName, rootFolder, tempFolder) => {
  const TEMP_STRING = "temp";
  issues.forEach((issue) => {
    let sourceaux = issue.source;
    issue.source = fileName;
    if (sourceaux?.startsWith("http")) {
      issue.fileName = sourceaux;
    } else if (tempFolder) {
      sourceaux = sourceaux ? sourceaux : tempFolder;
      issue.fileName = sourceaux.substring(tempFolder.indexOf(TEMP_STRING) + TEMP_STRING.length);
    } else {
      issue.fileName = cleanFileName(sourceaux, rootFolder);
    }
  });
};

module.exports = {
  RestLinter,
};
