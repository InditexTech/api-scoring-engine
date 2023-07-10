// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { truthy } = require("@stoplight/spectral-functions")

module.exports = {
    message: "{{error}}",
    recommended: true,
    severity: "warn",
    type: "validation",
    given: "$.info",
    then: {
      field: "description",
      function: truthy
    }
  }