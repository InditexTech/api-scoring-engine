// SPDX-FileCopyrightText: 2025 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const rulesConfig = require("./config/rules-config");
module.exports = {
  plugins: {
    "custom-rules": {
      rules: {
        "my-custom-rule": require("./my-custom-rule"),
      },
    },
  },
  rulesConfig: rulesConfig,
};
