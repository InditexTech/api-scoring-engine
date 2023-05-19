const { schema } = require("@stoplight/spectral-functions")

module.exports = {
    message: "{{error}}",
    description: "All the API will be versioned following the Semantic Versioning definition",
    severity: "warn",
    given: "$.info.version",
    then: {
      function: schema,
      functionOptions: {
        schema: {
          type: "string",
          pattern: "^[0-9]+\\.[0-9]+\\.[0-9]+$"
        }
      }
    }
  }