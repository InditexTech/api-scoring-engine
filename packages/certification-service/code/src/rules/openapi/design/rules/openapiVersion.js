// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const {
    pattern,
} = require("@stoplight/spectral-functions");

module.exports = {
    message: "OpenAPI version cannot be 3.1.X for the time being.",
    description: "OpenAPI cannot be 3.1.X for the time being.",
    severity: "error",
    given: "$.openapi",
    then: {
        function: pattern,
        functionOptions: {
            notMatch: "^3.1.\\d$"
        }
    }
}