// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { length } = require("@stoplight/spectral-functions")

module.exports = {
    message: "{{property}} should not be empty",
    description: "The schema is empty. This means that your API accepts any JSON values. Or payload does not have any properties defined.",
    severity: "error",
    given: "$..",
    then: {
        field: "schema",
        function: length,
        functionOptions: {
            min: 1
        }
    }
}