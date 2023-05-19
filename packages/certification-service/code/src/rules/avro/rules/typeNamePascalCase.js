const { casing } = require("@stoplight/spectral-functions")

module.exports = {
    description: "All type names must match PascalCase pattern",
    recommended: true,
    given: "$.name",
    then: {
      function: casing,
      functionOptions: {
        type: "pascal"
      }
    }
  }