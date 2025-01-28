// SPDX-FileCopyrightText: 2025 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { VALIDATION_TYPE_DESIGN } = require("./types");
const { cleanFileName } = require("./utils");
const { lintGraphql } = require("./lint");
const graphqlLinterDefaultConfig = require("../rules/grpahql");
const { INFO_SEVERITY } = require("../evaluate/severity");

class GraphqlLinter {
  constructor(config = {}) {
    this.configuration = graphqlLinterDefaultConfig;

    if (config?.rulesConfig?.rules) {
      this.configuration.rulesConfig.rules = config.rulesConfig.rules;
    }
    if (config?.rulesConfig?.severities) {
      this.configuration.rulesConfig.severities = config.rulesConfig.severities;
    }
    if (config?.plugins) {
      this.configuration.plugins = config.plugins;
    }
  }

  async lint(validationType, rootFolder, tempDir, design) {
    if (!validationType || validationType === VALIDATION_TYPE_DESIGN) {
      const result = await lintGraphql(rootFolder, this.configuration);
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
      design.designValidation.validationIssues = issues;
    }
  }

  get numberOfRulesExclidingInfoSeverity() {
    return Object.entries(this.configuration.rulesConfig.rules)
      .filter(([, value]) => {
        if (Array.isArray(value)) {
          return !value.includes("off");
        }
        return value !== "off";
      })
      .map(([ruleId]) => ruleId)
      .filter((ruleId) => this.configuration.rulesConfig.severities[ruleId] !== INFO_SEVERITY).length;
  }
}

module.exports = {
  GraphqlLinter,
};
