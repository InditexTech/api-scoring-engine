const { pattern } = require("@stoplight/spectral-functions")

module.exports = {
    message: "Operation uses unknown HTTP authentication method",
    description: "The API operation uses HTTP authentication method that is not included in IANA Authentication Scheme Registry",
    severity: "warn",
    given: "$.components.securitySchemes[*].scheme",
    then: {
        function: pattern,
        functionOptions: {
            match: "(.*[B-b]earer.*|.*[A-a]pi[K-k]ey.*|.*[B-b]asic.*|.*[O-o][A-a]uth2.*|.*[O-o]pen[I-i]d.*|.*[C-c]ookie[A-a]uth.*)"
        }
    }
}