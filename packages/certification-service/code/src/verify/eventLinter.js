// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { glob } = require("glob");
const path = require("path");
const fs = require("fs");
const { LintRuleset } = require("../evaluate/lint/lintRuleset");
const { lintFileWithSpectral } = require("./lint");
const { VALIDATION_TYPE_DESIGN, INVALID_REF_CUSTOMIZED } = require("./types");
const { cleanFileName, checkForErrors } = require("./utils");

class EventLinter {
  static async lintEvent({ file, validationType, fileName, apiDir, apiValidation, design, tempDir }) {
    if (fs.existsSync(file)) {
      if (!validationType || validationType === VALIDATION_TYPE_DESIGN) {
        const issues = await lintFileWithSpectral({
          file,
          ruleset: this.resolveEventGeneralRuleset().rulesetPath,
        });
        issues.forEach((issue) => {
          issue.message = issue.code == "invalid-ref" ? INVALID_REF_CUSTOMIZED : issue.message;
          issue.fileName = fileName;
          issue.source = cleanFileName(issue.source, tempDir);
        });
        apiValidation.hasErrors = checkForErrors(apiValidation, issues);
        design.designValidation.spectralValidation.issues.push(...issues);
      }
    }
    if (!validationType || validationType === VALIDATION_TYPE_DESIGN) {
      const avroFiles = await findAllAvroFiles(apiDir);
      for (const avroFile of avroFiles) {
        const issues = await lintFileWithSpectral({
          file: avroFile,
          ruleset: this.resolveAvroGeneralRuleset().rulesetPath,
        });
        issues.forEach((issue) => {
          issue.fileName = cleanFileName(avroFile, tempDir);
          issue.source = cleanFileName(issue.source, tempDir);
        });
        apiValidation.hasErrors = checkForErrors(apiValidation, issues);
        design.designValidation.spectralValidation.issues.push(...issues);
      }
    }
  }

  static resolveEventGeneralRuleset() {
    return LintRuleset.EVENT_GENERAL;
  }

  static resolveAvroGeneralRuleset() {
    return LintRuleset.AVRO_GENERAL;
  }
}

const findAllAvroFiles = (apiDir) => {
  return glob.sync(apiDir + "/**/*.avsc", {});
};

module.exports = {
  EventLinter,
};
