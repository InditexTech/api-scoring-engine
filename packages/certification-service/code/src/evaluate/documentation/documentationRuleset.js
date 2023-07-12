// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { INFO_SEVERITY } = require("../severity");
const markdownlint = require("markdownlint");
const { configValue } = require("../../config/config");
const { getAppLogger } = require("../../log");
const path = require("path");

const logger = getAppLogger();
const NUMBER_OF_BASE_RULES = configValue("cerws.markdown.number-of-base-rules");
const CUSTOM_RULESET_PREFIX = "custom";

class DocumentationRuleset {
  static API = new DocumentationRuleset(
    path.join(process.cwd(), configValue("cerws.markdown.markdown-lint-api-custom-rules")),
  );

  rulesetPath;
  resolvedRuleset;
  numberOfRules;

  constructor(rulesetPath) {
    logger.debug(`New DocumentationRuleset with rulesetPath: ${rulesetPath}`);
    this.rulesetPath = rulesetPath;
    // eslint-disable-next-line node/global-require
    this.resolvedRuleset = require(rulesetPath);
    this.updateNumberOfRules();
    logger.debug(`Resolved Ruleset on New DocumentationRuleset: ${JSON.stringify(this.resolvedRuleset)}`);
  }

  updateNumberOfRules() {
    let totalCustomRules = 0;

    logger.debug(`Recovering markdownlint config...`);
    const markdownlintConfig = markdownlint.readConfigSync(
      path.join(process.cwd(), configValue("cerws.markdown.markdown-lint-config")),
    );
    logger.debug(`markdownlint config recovered: ${JSON.stringify(markdownlintConfig)}`);

    try {
      // Exclude rules with 'info' severity
      if (markdownlintConfig && markdownlintConfig.severities) {
        logger.debug(`markdownlint config found`);
        const rulesetFiltered = this.resolvedRuleset.all.filter((rule) => {
          const severityFound = markdownlintConfig.severities.find((s) => {
            return rule.names.includes(s.id);
          });

          if (severityFound) {
            return severityFound.severity !== INFO_SEVERITY;
          }
          return true;
        });
        totalCustomRules = rulesetFiltered.length;
      } else {
        logger.debug(`markdownlint config not found`);
        totalCustomRules = this.resolvedRuleset.all.length;
      }
    } catch (e) {
      logger.warn(`Returning 0 rules because couldn't read file ${this.rulesetPath}. Exception: ${e}`);
    }

    logger.debug(`There are ${totalCustomRules} custom markdown rules in file: ${this.rulesetPath}`);

    this.numberOfRules = totalCustomRules;
  }

  static numberOfAllCustomRules() {
    return Object.keys(DocumentationRuleset).reduce((number, ruleRules) => {
      return number + this[ruleRules].numberOfRules;
    }, 0);
  }

  static updateKnownRulesets() {
    logger.debug(`Updating documentation rulesets...`);
    Object.keys(DocumentationRuleset).forEach((rulesetName) => {
      this[rulesetName].numberOfRules = this[rulesetName].updateNumberOfRules();
    });
    logger.debug(`Documentation rulesets updated`);
  }
}

module.exports = { DocumentationRuleset, NUMBER_OF_BASE_RULES, CUSTOM_RULESET_PREFIX };
