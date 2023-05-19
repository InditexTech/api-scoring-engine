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
      const readmeIssues = await this.validateReadme(rootFolder, api);
      documentation.documentationValidation.issues.push(...readmeIssues);
    }
  }

  static async validateReadme(rootFolder, api) {
    const apiReadmeFile = {
      fullPath: path.join(rootFolder, api["definition-path"], "README.md"),
      fileName: path.join(api["definition-path"], "README.md").replace(/\\/g, "/"),
      customRules: DocumentationRuleset.API.resolvedRuleset,
    };
    const issues = [];
    const readmePath = apiReadmeFile.fullPath;
    const readmeFileType = "API README";

    if (fs.existsSync(readmePath)) {
      if (checkMarkdownContent(readmePath)) {
        issues.push(...(await lintFileWithMarkdownLint(readmePath, apiReadmeFile.customRules)));
        issues.forEach((issue) => (issue.fileName = apiReadmeFile.fileName));
      } else {
        issues.push({
          lineNumber: 1,
          ruleNames: [CUSTOM_RULES_NAMES.README_MUST_HAVE_CONTENT, "custom-readme-does-not-have-content"],
          ruleDescription: `${readmeFileType} hasn't enough content`,
          //ruleInformation: "TBD",
          errorDetail: null,
          errorContext: `${readmeFileType} hasn't enough content`,
          errorRange: null,
          severity: ERROR_SEVERITY,
        });
      }
    } else {
      // Create Readme exists rule in markdownlint
      issues.push({
        lineNumber: 1,
        ruleNames: [CUSTOM_RULES_NAMES.README_MUST_EXISTS, "custom-readme-does-not-exist"],
        ruleDescription: `${readmeFileType} file must exist`,
        //ruleInformation: "TBD",
        errorDetail: null,
        errorContext: `${readmeFileType} file must exist`,
        errorRange: null,
        severity: ERROR_SEVERITY,
      });
    }

    return issues;
  }
}

const checkMarkdownContent = (filePath) => {
  const data = fs.readFileSync(filePath, "utf8");
  const nrValuableLines = data
    .toString()
    .split("\n")
    .filter((x) => x.length > configValue("cerws.markdown.number-of-minimum-line-size")).length;
  const nrMinimumValuableLines = configValue("cerws.markdown.number-of-minimum-lines");
  return nrValuableLines > nrMinimumValuableLines;
};

module.exports = {
  DocumentationLinter,
  CUSTOM_RULES_NAMES,
};
