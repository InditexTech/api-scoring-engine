// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { length } = require("@stoplight/spectral-functions")

module.exports = {
    message: "Security field contains an empty array",
    description: "One or more of the objects defined in the global security field contain an empty security requirement",
    severity: "warn",
    given: "$",
    then: {
      field: "security",
      function: length,
      functionOptions: {
        min: 1
      }
    }
  }