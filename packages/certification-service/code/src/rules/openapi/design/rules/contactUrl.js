// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const {
    pattern,
} = require("@stoplight/spectral-functions");

module.exports = {
    message: "Contact email should be a valid URI",
    description: "Contact email should be a valid URI",
    severity: "error",
    given: "$.info",
    then: {
        field: "contact.url",
        function: pattern,
        functionOptions: {
            match: "^\\w+:(\\/?\\/?)[^\\s]+$"
        }
    }
};
