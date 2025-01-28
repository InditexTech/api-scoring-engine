// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { LintRuleset } = require("../evaluate/lint/lintRuleset");
const { lintFileWithSpectral } = require("./lint");
const { VALIDATION_TYPE_DESIGN, VALIDATION_TYPE_SECURITY } = require("./types");
const { checkForErrors, cleanFileName } = require("./utils");

class RestLinter {
  static async lintRest({ validationType, file, fileName, apiValidation, design, security, tempDir }) {
    if (!validationType || validationType === VALIDATION_TYPE_DESIGN) {
      const issues = await lintFileWithSpectral({
        file,
        ruleset: this.resolveGeneralRuleset().rulesetPath,
      });
      addFileNameToIssues(issues, fileName, tempDir);
      apiValidation.hasErrors = checkForErrors(apiValidation, issues);
      issues.forEach((issue) => (issue.source = issue.fileName));
      design.designValidation.spectralValidation.issues.push(...issues);
      design.designValidation.validationIssues = issues.map((issue) => {
        return {
          fileName: issue.fileName,
          code: issue.code,
          message: issue.message,
          severity: issue.severity,
          range: {
            start: {
              line: issue.range?.start?.line,
              character: issue.range?.start?.character,
            },
            end: {
              line: issue.range?.end?.line,
              character: issue.range?.end?.character,
            },
          },
          path: issue.path,
        };
      });
    }
    if (!validationType || validationType === VALIDATION_TYPE_SECURITY) {
      const issues = await lintFileWithSpectral({
        file,
        ruleset: this.resolveSecurityRuleset().rulesetPath,
      });

      addFileNameToIssues(issues, fileName, tempDir);
      apiValidation.hasErrors = checkForErrors(apiValidation, issues);
      issues.forEach((issue) => (issue.source = issue.fileName));
      security.securityValidation.spectralValidation.issues.push(...issues);
      security.securityValidation.validationIssues = issues.map((issue) => {
        return {
          fileName: issue.fileName,
          code: issue.code,
          message: issue.message,
          severity: issue.severity,
          range: {
            start: {
              line: issue.range?.start?.line,
              character: issue.range?.start?.character,
            },
            end: {
              line: issue.range?.end?.line,
              character: issue.range?.end?.character,
            },
          },
          path: issue.path,
        };
      });
    }
  }

  static resolveGeneralRuleset() {
    return LintRuleset.REST_GENERAL;
  }

  static resolveSecurityRuleset() {
    return LintRuleset.REST_SECURITY;
  }
}

const addFileNameToIssues = (issues, fileName, apiDir) => {
  issues.forEach((issue) => {
    let sourceaux = issue.source;
    issue.source = fileName;
    if (sourceaux?.startsWith("http")) {
      issue.fileName = sourceaux;
    } else {
      issue.fileName = cleanFileName(sourceaux, apiDir);
    }
  });
};

module.exports = {
  RestLinter,
};
