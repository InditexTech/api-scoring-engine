// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { falsy } = require("@stoplight/spectral-functions")

module.exports = {
    message: "Operation uses resource owner password",
    description: "The API operation uses resource owner password grant flow in OAuth2 authentication",
    severity: "error",
    given: "$.components.securitySchemes.OAuth2.flows",
    then: {
        field: "password",
        function: falsy
    }
}