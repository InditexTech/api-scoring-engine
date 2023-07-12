// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const path = require("path");
const fs = require("fs");
const { VALIDATION_TYPE_DOCUMENTATION } = require("./types");
const { DocumentationRuleset } = require("../evaluate/documentation/documentationRuleset");
const { ERROR_SEVERITY } = require("../evaluate/severity");
const { lintFileWithMarkdownLint } = require("./lint");
const { configValue } = require("../config/config");

const CUSTOM_RULES_NAMES = {
  README_MUST_EXISTS: "EX_MD063",
  README_MUST_HAVE_CONTENT: "EX_MD064",
};

class DocumentationLinter {
  static async lintDocumentation(validationType, rootFolder, api, documentation) {
    if (!validationType || validationType === VALIDATION_TYPE_DOCUMENTATION) {
      const apiReadmeFile = {
        fullPath: path.join(rootFolder, api["definition-path"], "README.md"),
        fileName: path.join(api["definition-path"], "README.md").replace(/\\/g, "/"),
        type: "API README",
        customRules: DocumentationRuleset.API.resolvedRuleset,
      };

      const readmeIssues = await this.validateReadme(apiReadmeFile);

      documentation.documentationValidation.issues.push(...readmeIssues);
    }
  }

  static async validateReadme(readmeFile) {
    const issues = [];
    const readmePath = readmeFile.fullPath;

    if (fs.existsSync(readmePath)) {
      if (this.checkMarkdownContent(readmePath)) {
        issues.push(...(await lintFileWithMarkdownLint(readmePath, readmeFile.customRules)));
        issues.forEach((issue) => (issue.fileName = readmeFile.fileName));
      } else {
        issues.push({
          lineNumber: 1,
          ruleNames: [CUSTOM_RULES_NAMES.README_MUST_HAVE_CONTENT, "custom-readme-does-not-have-content"],
          ruleDescription: `${readmeFile.type} hasn't enough content`,
          //ruleInformation: "TBD",
          errorDetail: null,
          errorContext: `${readmeFile.type} hasn't enough content`,
          errorRange: null,
          severity: ERROR_SEVERITY,
        });
      }
    } else {
      // Create Readme exists rule in markdownlint
      issues.push({
        lineNumber: 1,
        ruleNames: [CUSTOM_RULES_NAMES.README_MUST_EXISTS, "custom-readme-does-not-exist"],
        ruleDescription: `${readmeFile.type} file must exist`,
        //ruleInformation: "TBD",
        errorDetail: null,
        errorContext: `${readmeFile.type} file must exist`,
        errorRange: null,
        severity: ERROR_SEVERITY,
      });
    }

    return issues;
  }

  static checkMarkdownContent(filePath) {
    const data = fs.readFileSync(filePath, "utf8");
    const nrValuableLines = data
      .toString()
      .split("\n")
      .filter((x) => x.length > configValue("cerws.markdown.number-of-minimum-line-size")).length;
    const nrMinimumValuableLines = configValue("cerws.markdown.number-of-minimum-lines");
    return nrValuableLines > nrMinimumValuableLines;
  }
}

module.exports = {
  DocumentationLinter,
  CUSTOM_RULES_NAMES,
};
