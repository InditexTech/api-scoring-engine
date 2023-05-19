const { enumeration } = require("@stoplight/spectral-functions")

module.exports = {
    message: "{{error}}",
    description: "Use always HTTP verbs to refer to actions in urls [13]",
    severity: "warn",
    given: "$.paths.*.*~",
    then: {
      function: enumeration,
      functionOptions: {
        values: [
          "get",
          "post",
          "put",
          "delete",
          "patch",
          "parameters"
        ]
      }
    }
  }