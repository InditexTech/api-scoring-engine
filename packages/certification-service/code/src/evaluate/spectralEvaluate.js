// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { Spectral, Document } = require("@stoplight/spectral-core");
const Parsers = require("@stoplight/spectral-parsers");
const { fetch } = require("@stoplight/spectral-runtime");
const { bundleAndLoadRuleset } = require("@stoplight/spectral-ruleset-bundler/with-loader");
const { builtins } = require("@stoplight/spectral-ruleset-bundler/plugins/builtins");
const commonjs = require("@rollup/plugin-commonjs");
const { INFO_SEVERITY } = require("./severity");
const { getAppLogger } = require("../log");
const fs = require("fs");
const path = require("path");

const logger = getAppLogger();

const retrieveNumberOfRules = async (ruleset) => {
  let numberOfRules = 0;

  const spectral = new Spectral();

  try {
    logger.debug(`Retrieving number of rules for ruleset ${ruleset}...`);
    const fileExtension = path.extname(ruleset);
    if ([".yaml", ".yml"].includes(fileExtension)) {
      spectral.setRuleset(await bundleAndLoadRuleset(ruleset, { fs, fetch }, [builtins(), commonjs()]));
    } else {
      spectral.setRuleset(require(ruleset));
    }
    // Exclude rules with 'info' severity
    logger.debug(`Original number of rules is ${Object.keys(spectral.ruleset.rules).length}`);
    const rulesetFiltered = Object.entries(spectral.ruleset.rules).filter(
      ([_, value]) => value.enabled && value.severity != INFO_SEVERITY,
    );
    numberOfRules = Object.keys(rulesetFiltered).length;
    logger.debug(`Number of rules enabled and excluding info level is ${numberOfRules}`);
  } catch (e) {
    logger.warn(`Returning 0 rules because couldn't read ${ruleset}. Exception: ${e}`);
  }

  return numberOfRules;
};

const retrieveDocument = (filePath) => {
  const fileExtension = path.extname(filePath);
  const body = fs.readFileSync(filePath, "utf8");

  let parser = Parsers.Json;
  if ([".yaml", ".yml"].includes(fileExtension)) {
    parser = Parsers.Yaml;
  }

  return new Document(body, parser, filePath);
};

const evaluate = async (ruleset, apiSpecificationPath) => {
  const spectral = new Spectral();

  const fileExtension = path.extname(ruleset);

  if ([".yaml", ".yml"].includes(fileExtension)) {
    spectral.setRuleset(await bundleAndLoadRuleset(ruleset, { fs, fetch }, [builtins(), commonjs()]));
  } else {
    spectral.setRuleset(require(ruleset));
  }

  return spectral.run(retrieveDocument(apiSpecificationPath)).then((result) => result);
};

module.exports = { retrieveNumberOfRules, evaluate };
