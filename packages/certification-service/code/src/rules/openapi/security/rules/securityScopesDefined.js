const functions = require("./functions")

module.exports = {
    message: "{{error}}",
    description: "OAuth2 security requirement requires a scope not declared in the referenced security scheme",
    severity: "warn",
    given: "$",
    then: {
      function: functions.ensureScopeSecurity
    }
  }