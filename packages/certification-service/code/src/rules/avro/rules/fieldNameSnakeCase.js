// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { casing } = require("@stoplight/spectral-functions")

module.exports = {
    description: "All field names must match snake case pattern (e.g. snake_case)",
    recommended: true,
    given: "$..fields[*].name",
    then: {
      function: casing,
      functionOptions: {
        type: "snake"
      }
    }
  }