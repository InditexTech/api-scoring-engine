const { defined } = require("@stoplight/spectral-functions")

module.exports = {
    message: "{{error}}",
    description: "Numeric values should be limited in size to mitigate resource exhaustion",
    severity: "warn",
    given: [
      "$.[?(@ != null && @property.toString().toLowerCase() != \"id\" && @.type=='number')].",
      "$.[?(@ != null && @property.toString().toLowerCase() != \"id\" && @.type=='integer')]."
    ],
    then: [
      {
        field: "maximum",
        function: defined
      },
      {
        field: "minimum",
        function: defined
      }
    ]
  }