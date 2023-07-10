// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { pattern } = require('@stoplight/spectral-functions')

module.exports = {
    message: "paths should not contain underscores",
    description: "Use kebab-case naming in urls.[16]",
    severity: "warn",
    given: "$.paths.*~",
    then: {
        function: pattern,
        functionOptions: {
            match: "^((?!_).)*$"
        }
    }
}