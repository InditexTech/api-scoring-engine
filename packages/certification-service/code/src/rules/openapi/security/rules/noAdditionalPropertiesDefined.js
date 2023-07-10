// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { defined } = require("@stoplight/spectral-functions")

module.exports = {
    message: "{{error}}",
    description: "While forbidding additionalProperties can create rigidity and hinder the evolution of an API - eg making it hard to accept new parameters or fields - it is possible that this flexibility can be used to bypass the schema validator and force the application to process unwanted information.",
    severity: "warn",
    given: "$.[?(@ != null && @.type==\"object\")].",
    then: [
        {
            field: "additionalProperties",
            function: defined
        }
    ]
}