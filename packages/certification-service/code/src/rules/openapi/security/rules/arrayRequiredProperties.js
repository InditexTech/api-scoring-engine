const { defined } = require("@stoplight/spectral-functions")

module.exports = {
    message: "Schema of type array must specify maxItems",
    description: "Array size should be limited to mitigate resource exhaustion attacks. This can be done using `maxItems`",
    severity: "warn",
    given: [
        "$.[?(@ != null && @.type=='array')]."
    ],
    then: [
        {
            field: "maxItems",
            function: defined
        }
    ]
}