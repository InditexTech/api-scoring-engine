// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const markdownlint = require("markdownlint");
const { WARN_SEVERITY } = require("./severity");
const { configValue } = require("../config/config");
const path = require("path");

const markdownEvaluate = async (filepath, ruleset, customConfig) => {
  const defaultConfig = configValue("cerws.markdown.markdown-lint-config");
  const options = {
    files: [filepath],
    config: customConfig ? customConfig : markdownlint.readConfigSync(path.join(process.cwd(), defaultConfig)),
    customRules: ruleset.all,
  };

  let result = await markdownlint.promises.markdownlint(options);

  if (options.config.severities) {
    result[Object.keys(result)[0]].forEach((item) => {
      if (options.config.severities.filter((x) => item.ruleNames.includes(x.id)).length > 0) {
        const severityObj = options.config.severities.filter((x) => item.ruleNames.includes(x.id));
        item.severity = severityObj[0].severity;
      } else {
        item.severity = WARN_SEVERITY;
      }
    });
  } else {
    result[Object.keys(result)[0]].forEach((item) => {
      item.severity = WARN_SEVERITY;
    });
  }

  return result;
};

module.exports = { markdownEvaluate };
