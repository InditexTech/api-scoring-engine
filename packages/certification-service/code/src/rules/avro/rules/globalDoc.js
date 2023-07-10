// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const functions = require("./functions")

module.exports = {
  description: "Definition `doc` must be present and non-empty string in all types",
  recommended: true,
  severity: "warn",
  given: "$",
  then: {
    function: functions.checkDoc
  }
}