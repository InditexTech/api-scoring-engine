// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const functions = require("./functions")

module.exports = {
    message: "{{error}}",
    description: "Authentication SHOULD support Basic and Bearer type [43]",
    severity: "warn",
    given: "$.components.securitySchemes.",
    then: {
      function: functions.ensureBasicBearerAuth
    }
  }