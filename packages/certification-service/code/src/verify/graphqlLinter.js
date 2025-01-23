// SPDX-FileCopyrightText: 2025 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { VALIDATION_TYPE_DESIGN } = require("./types");
const { cleanFileName } = require("./utils");
const { lintGraphql } = require("./lint");

class GraphqlLinter {
  static async lintGrapql(validationType, rootFolder, tempDir, design) {
    if (!validationType || validationType === VALIDATION_TYPE_DESIGN) {
      const result = await lintGraphql(rootFolder);
      let issues = [];
      result.forEach((element) => {
        element.messages.forEach((message) =>
          issues.push({
            fileName: cleanFileName(element.filePath, tempDir),
            code: message.messageId || message.ruleId, // message.ruleId
            message: message.message,
            severity: message.severity,
            range: {
              start: {
                line: message.line,
                character: message.column,
              },

              end: { line: message.endLine, character: message.endColumn },
            },
            path: [],
          }),
        );
      });
      design.designValidation.issues = issues;
    }
  }
}

module.exports = {
  GraphqlLinter,
};
