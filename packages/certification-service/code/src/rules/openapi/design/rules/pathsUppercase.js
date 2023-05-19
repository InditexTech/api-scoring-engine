const {
    pattern
} = require("@stoplight/spectral-functions");

module.exports = {
    message: "paths should not be in uppercase",
    description: "Urls should follow a lowercase pattern [15]",
    severity: "warn",
    given: "$.paths.*~",
    then: {
        function: pattern,
        functionOptions: {
            notMatch: "(\\/[^\\{]+[A-Z].*).*"
        }
    }
}