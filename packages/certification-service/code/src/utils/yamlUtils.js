// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const yaml = require("js-yaml");
const fs = require("fs");
const { getAppLogger } = require("../log");

const logger = getAppLogger();

const parseYaml = (path) => {
  let doc;

  try {
    doc = yaml.load(fs.readFileSync(path, "utf-8"));
  } catch (error) {
    logger.error(`Can not read yml at ${path}: ${error.message}`);
  }

  return doc;
};

module.exports = { parseYaml };
