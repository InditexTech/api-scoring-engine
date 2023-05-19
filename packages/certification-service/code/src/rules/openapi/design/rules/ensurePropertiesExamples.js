const functions = require("./functions")

module.exports = {
    message: "{{property}} doesn't have an example",
    description: "Properties must have examples, description and type [34.1]",
    severity: "warn",
    given: "$.components.schemas..properties[*]",
    then: {
        function: functions.ensurePropertiesExamples
    }
}