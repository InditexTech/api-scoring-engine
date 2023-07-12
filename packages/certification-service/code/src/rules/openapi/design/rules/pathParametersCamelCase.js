// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { casing } = require('@stoplight/spectral-functions');

module.exports = {
    message: "path parameters should be camelCase",
    description: "Use camelCase naming for attributes in request/responses and definitions [17.2]",
    severity: "warn",
    given: "$.paths.*.*.parameters[?(@.in=='path')].name",
    then: {
        function: casing,
        functionOptions: {
            type: "camel"
        }
    }
}