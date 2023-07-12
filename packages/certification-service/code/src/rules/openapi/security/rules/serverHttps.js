// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { pattern } = require("@stoplight/spectral-functions")

module.exports = {
    message: "Server objects should support https",
    description: "Set all server objects to support HTTPS only so that all traffic is encrypted.",
    severity: "warn",
    given: "$.servers[*].url",
    then: {
      function: pattern,
      functionOptions: {
        match: "(https.*|.*localhost.*)"
      }
    }
  }