// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { casing } = require("@stoplight/spectral-functions")

module.exports = {
    description: "All type names must match PascalCase pattern",
    recommended: true,
    given: "$.name",
    then: {
      function: casing,
      functionOptions: {
        type: "pascal"
      }
    }
  }