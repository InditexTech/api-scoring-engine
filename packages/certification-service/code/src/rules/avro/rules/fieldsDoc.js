// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { truthy } = require("@stoplight/spectral-functions")

module.exports = {
    description: "Definition `doc` must be present and non-empty string in all fields",
    recommended: true,
    severity: "warn",
    given: "$.fields[*]",
    then: {
      field: "doc",
      function: truthy
    }
  }