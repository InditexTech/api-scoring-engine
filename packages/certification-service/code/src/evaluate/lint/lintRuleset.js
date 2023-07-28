// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const path = require("path");
const { retrieveNumberOfRules } = require("../spectralEvaluate");
const { configValue } = require("../../config/config");

class LintRuleset {
  static REST_GENERAL = new LintRuleset(
    path.join(process.cwd(), configValue("cerws.lint.rest.general-default-ruleset")),
  );
  static REST_SECURITY = new LintRuleset(
    path.join(process.cwd(), configValue("cerws.lint.rest.security-default-ruleset")),
  );
  static EVENT_GENERAL = new LintRuleset(
    path.join(process.cwd(), configValue("cerws.lint.event.general-default-ruleset")),
  );
  static AVRO_GENERAL = new LintRuleset(
    path.join(process.cwd(), configValue("cerws.lint.avro.general-default-ruleset")),
  );
  rulesetPath;
  numberOfRules;

  constructor(rulesetPath) {
    this.rulesetPath = rulesetPath;
  }

  async updateNumberOfRules() {
    this.numberOfRules = await retrieveNumberOfRules(this.rulesetPath);
  }

  static async updateKnownRulesets() {
    await Promise.all(
      Object.keys(LintRuleset).map(async (rulesetName) => {
        await this[rulesetName].updateNumberOfRules();
      }),
    );
  }
}

module.exports = { LintRuleset };
