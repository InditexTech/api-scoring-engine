// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { casing } = require("@stoplight/spectral-functions")

module.exports = {
    message: "query parameters should be camelCase",
    description: "Use camelCase naming for attributes in request/responses and definitions [17.1]",
    severity: "warn",
    given: "$.paths.*.*.parameters[?(@.in=='query')].name",
    then: {
        function: casing,
        functionOptions: {
            type: "camel"
        }
    }
}