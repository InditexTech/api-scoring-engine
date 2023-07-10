// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { defined } = require("@stoplight/spectral-functions")

module.exports = {
    message: "{{error}}",
    description: "The security field of your API contract does not list any security schemes to be applied",
    severity: "warn",
    given: "$.components.~",
    then: {
      field: "securitySchemes",
      function: defined
    }
  }