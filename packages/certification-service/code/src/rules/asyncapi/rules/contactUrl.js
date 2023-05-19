const { pattern } = require("@stoplight/spectral-functions")

module.exports = {
    message: "Contact email should be a valid URI",
    description: "Contact email should be a valid URI",
    severity: "error",
    given: "$",
    then: {
        field: "info.contact.url",
        function: pattern,
        functionOptions: {
            match: "^\\w+:(\\/?\\/?)[^\\s]+$"
        }
    }
}