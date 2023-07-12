// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const functions = require("./functions")

module.exports = {
    message: "{{error}}",
    description: "OAuth2 security requirement requires a scope not declared in the referenced security scheme",
    severity: "warn",
    given: "$",
    then: {
      function: functions.ensureScopeSecurity
    }
  }