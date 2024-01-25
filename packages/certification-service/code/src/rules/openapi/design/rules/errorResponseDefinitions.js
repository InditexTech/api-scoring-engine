// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const {
    schema,
} = require("@stoplight/spectral-functions");

module.exports = {
    message: "{{property}}: {{error}}",
    description: "Define errors in your API following our version of the Problem Details RFC7807.",
    severity: "warn",
    given: "$..responses[400,401,402,403,404,406,407,408,409,410,411,412,413,414,415,416,417,423,426,428,429,431,500,503,504]..content.*.schema",
    then: {
        function: schema,
        functionOptions: {
            schema: {
                type: "object",
                required: [
                    "properties",
                    "additionalProperties"
                ]
            }
        }
    }
}