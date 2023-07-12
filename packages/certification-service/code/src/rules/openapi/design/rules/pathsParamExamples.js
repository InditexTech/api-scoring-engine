// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const functions = require("./functions")

module.exports = {
    message: "{{error}}",
    description: "Parameters must have examples[34]",
    severity: "warn",
    resolved: true,
    given: "$.paths[*]..parameters[*]",
    then: {
        function: functions.ensureParameteresExamples
    }
}