// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { falsy } = require("@stoplight/spectral-functions")

module.exports = {
    message: "Negotiating authentication not allowed",
    description: "Do not use the security scheme negotiateAuth",
    severity: "warn",
    given: "$.components.securitySchemes",
    then: {
      field: "negotiateAuth",
      function: falsy
    }
  }