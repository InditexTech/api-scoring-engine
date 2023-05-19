const { casing } = require("@stoplight/spectral-functions")

module.exports = {
    message: "Property name has to be camelCase",
    description: "Use camelCase naming for attributes in request/responses and definitions [17]",
    severity: "warn",
    given: "$.components.schemas.*.properties[*]~",
    then: {
        function: casing,
        functionOptions: {
            type: "camel"
        }
    }
}