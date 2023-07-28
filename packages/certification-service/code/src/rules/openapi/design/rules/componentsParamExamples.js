// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { defined } = require("@stoplight/spectral-functions")

module.exports = {
    message: "{{error}}",
    description: "Parameters must have examples[34]",
    severity: "warn",
    given: "$.components..parameters[*]",
    then: {
        field: "example",
        function: defined
    }
}