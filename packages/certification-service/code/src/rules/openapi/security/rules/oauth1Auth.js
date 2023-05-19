const { falsy } = require("@stoplight/spectral-functions")

module.exports = {
    message: "OAuth 1.0 authentication not allowed",
    description: "One or more global security schemes in your API allows using OAuth 1.0 authentication",
    severity: "error",
    given: "$.components.securitySchemes",
    then: {
        field: "OAuth1",
        function: falsy
    }
}