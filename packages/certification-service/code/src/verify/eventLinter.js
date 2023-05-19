const { glob } = require("glob");
const path = require("path");
const fs = require("fs");
const { LintRuleset } = require("../evaluate/lint/lintRuleset");
const { lintFileWithSpectral } = require("./lint");
const { VALIDATION_TYPE_DESIGN, INVALID_REF_CUSTOMIZED } = require("./types");
const { cleanFileName, checkForErrors } = require("./utils");

class EventLinter {
  static async lintEvent({ file, validationType, fileName, rootFolder, apiValidation, design, api }) {
    if (fs.existsSync(file)) {
      if (!validationType || validationType === VALIDATION_TYPE_DESIGN) {
        const issues = await lintFileWithSpectral({
          file,
          ruleset: LintRuleset.EVENT_GENERAL.rulesetPath,
        });
        issues.forEach((issue) => {
          issue.message = issue.code == "invalid-ref" ? INVALID_REF_CUSTOMIZED : issue.message;
          issue.fileName = fileName;
          issue.source = cleanFileName(issue.source, rootFolder);
        });
        apiValidation.hasErrors = checkForErrors(apiValidation, issues);
        design.designValidation.spectralValidation.issues.push(...issues);
      }
    }
    if (!validationType || validationType === VALIDATION_TYPE_DESIGN) {
      const avroFiles = await findAllAvroFiles(rootFolder, api);
      for (const avroFile of avroFiles) {
        const issues = await lintFileWithSpectral({
          file: avroFile,
          ruleset: LintRuleset.AVRO_GENERAL.rulesetPath,
        });
        issues.forEach((issue) => {
          issue.fileName = cleanFileName(avroFile, rootFolder);
          issue.source = cleanFileName(issue.source, rootFolder);
        });
        apiValidation.hasErrors = checkForErrors(apiValidation, issues);
        design.designValidation.spectralValidation.issues.push(...issues);
      }
    }
  }
}

const findAllAvroFiles = (rootFolder, api) => {
  return glob.sync(path.join(rootFolder, api["definition-path"]) + "/**/*.avsc", {});
};

module.exports = {
  EventLinter,
};
