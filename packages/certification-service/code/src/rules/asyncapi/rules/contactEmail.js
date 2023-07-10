// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { truthy } = require("@stoplight/spectral-functions")

module.exports = {
    description: "Definition must have a contact email",
    recommended: true,
    severity: "warn",
    type: "validation",
    given: "$",
    then: {
      field: "info.contact.email",
      function: truthy
    }
  }