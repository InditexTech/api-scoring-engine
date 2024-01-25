// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const rules = require("./rules")

module.exports = {
    rules:{
        "field-name-snake_case" : rules.fieldNameSnakeCase,
        "fields-doc" : rules.fieldsDoc,
        "global-doc" : rules.globalDoc,
        "type-name-pascal-case" : rules.typeNamePascalCase
    }
}