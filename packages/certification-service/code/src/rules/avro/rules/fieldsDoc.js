const { truthy } = require("@stoplight/spectral-functions")

module.exports = {
    description: "Definition `doc` must be present and non-empty string in all fields",
    recommended: true,
    severity: "warn",
    given: "$.fields[*]",
    then: {
      field: "doc",
      function: truthy
    }
  }