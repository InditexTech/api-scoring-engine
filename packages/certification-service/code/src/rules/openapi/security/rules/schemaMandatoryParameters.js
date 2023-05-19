const { truthy } = require("@stoplight/spectral-functions")

module.exports = {
    message: "{{error}}",
    description: "One or more parameters in your API do not have schemas defined. All parameters must have either schema or content defined to restrict what content your API accepts.",
    severity: "warn",
    given: "$.paths.*.*.parameters[*]",
    then: {
      field: "schema",
      function: truthy
    }
  }