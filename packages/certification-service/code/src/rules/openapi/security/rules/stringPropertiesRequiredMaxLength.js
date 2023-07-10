// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { truthy } = require("@stoplight/spectral-functions")

module.exports = {
    message: "{{error}}",
    description: "String should be limited and with a maxLength to avoid out of format inputs by attackers",
    severity: "warn",
    given: "$..properties[?(@ != null && @.type=='string' && !@.enum && @.format!='date' && @.format !='date-time' && !@property.toString().toLowerCase().endsWith('id'))]",
    then: [
        {
            field: "maxLength",
            function: truthy
        }
    ]
}
