const { length } = require("@stoplight/spectral-functions")

module.exports = {
    message: "Security field contains an empty array",
    description: "One or more of the objects defined in the global security field contain an empty security requirement",
    severity: "warn",
    given: "$",
    then: {
      field: "security",
      function: length,
      functionOptions: {
        min: 1
      }
    }
  }