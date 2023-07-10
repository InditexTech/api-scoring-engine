// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { defined } = require("@stoplight/spectral-functions")

module.exports = {
    message: "Global 'security' field is not defined",
    description: "use the security field on the global level to set the default authentication requirements for the whole API",
    severity: "error",
    given: "$",
    then: {
      field: "security",
      function: defined
    }
  }