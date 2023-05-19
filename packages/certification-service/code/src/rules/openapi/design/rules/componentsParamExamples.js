const { defined } = require("@stoplight/spectral-functions")

module.exports = {
    message: "{{error}}",
    description: "Parameters must have examples[34]",
    severity: "warn",
    given: "$.components..parameters[*]",
    then: {
        field: "example",
        function: defined
    }
}