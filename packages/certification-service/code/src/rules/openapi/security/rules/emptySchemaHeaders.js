const { truthy } = require("@stoplight/spectral-functions")

module.exports = {
    message: "No schema defined in the header object",
    description: "A header object does not define a schema for the accepted input or output. This means that you do not limit the what your API can accept or include in headers. Define schemas for all header objects to restrict what input or output is allowed",
    severity: "warn",
    given: "$..headers.*",
    then: {
      field: "schema",
      function: truthy
    }
  }