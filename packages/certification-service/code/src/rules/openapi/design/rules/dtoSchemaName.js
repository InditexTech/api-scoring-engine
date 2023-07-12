// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { pattern } = require("@stoplight/spectral-functions")

module.exports = {
    message: "schema cannot end with dto",
    description: "You SHOULD avoid ending your schemas (..schemas[*]~) with suffixes like {dto,DTO,Dto}",
    severity: "warn",
    given: "$.components.schemas[*]~",
    then: {
        function: pattern,
        functionOptions: {
            match: "^(?:(?!(dto|DTO|Dto)).)*$"
        }
    }
}