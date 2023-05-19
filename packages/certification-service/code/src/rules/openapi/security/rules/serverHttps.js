const { pattern } = require("@stoplight/spectral-functions")

module.exports = {
    message: "Server objects should support https",
    description: "Set all server objects to support HTTPS only so that all traffic is encrypted.",
    severity: "warn",
    given: "$.servers[*].url",
    then: {
      function: pattern,
      functionOptions: {
        match: "(https.*|.*localhost.*)"
      }
    }
  }