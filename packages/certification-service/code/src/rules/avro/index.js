const rules = require("./rules")

module.exports = {
    rules:{
        "field-name-snake_case" : rules.fieldNameSnakeCase,
        "fields-doc" : rules.fieldsDoc,
        "global-doc" : rules.globalDoc,
        "type-name-pascal-case" : rules.typeNamePascalCase
    }
}