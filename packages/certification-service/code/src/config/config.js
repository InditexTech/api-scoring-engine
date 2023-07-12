// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const config = require("config");

const configValue = (property, defaultValue) => {
  if (!config.has(property)) {
    return defaultValue;
  }
  return config.get(property);
};

module.exports = {
  configValue,
};
