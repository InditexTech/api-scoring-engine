const functions = require("./functions")

module.exports = {
    message: "{{error}}",
    description: "Parameters must have examples[34]",
    severity: "warn",
    resolved: true,
    given: "$.paths[*]..parameters[*]",
    then: {
        function: functions.ensureParameteresExamples
    }
}