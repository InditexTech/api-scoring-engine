// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { truthy } = require("@stoplight/spectral-functions")

module.exports = {
    message: "{{error}}",
    description: "String should be limited and with a maxLength to avoid out of format inputs by attackers",
    severity: "warn",
    given: "$..parameters[?(@.name != null && !@.name.toLowerCase().endsWith('id'))].[?(@ != null && @.type=='string' && !@.enum && @.format!='date' && @.format !='date-time')])]",
    then: [
        {
            field: "maxLength",
            function: truthy
        }
    ]
}