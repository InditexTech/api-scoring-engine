// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
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