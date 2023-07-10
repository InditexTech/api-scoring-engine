// SPDX-FileCopyrightText: 2023 Inditex
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