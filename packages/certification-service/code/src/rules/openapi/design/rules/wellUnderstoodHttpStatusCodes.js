// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const functions = require("./functions")

module.exports = {
    message: "{{error}}",
    description: "HTTP response codes cannot be used on all HTTP verbs [29.9]",
    severity: "warn",
    given: "$.paths.*",
    then: {
        function: functions.assertHttpCodesForOperation,
        functionOptions: {
            wellUnderstood: {
                "200": ["ALL"],
                "201": [
                    "POST",
                    "PUT"
                ],
                "202": ["ALL"],
                "204": [
                    "ALL"
                ],
                "400": [
                    "ALL"
                ],
                "401": [
                    "ALL"
                ],
                "403": [
                    "ALL"
                ],
                "404": [
                    "ALL"
                ],
                "409": [
                    "POST",
                    "PUT",
                    "DELETE"
                ],
                "429": [
                    "ALL"
                ],
                "500": [
                    "ALL"
                ],
                "503": [
                    "ALL"
                ],
                "504": [
                    "ALL"
                ],
                "default": [
                    "ALL"
                ]
            }
        }
    }
}