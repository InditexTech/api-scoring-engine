const {
    truthy,
} = require("@stoplight/spectral-functions");

module.exports = {
    description: "Definition must have a contact email",
    recommended: true,
    severity: "warn",
    type: "validation",
    given: "$.info",
    then: {
        field: "contact.email",
        function: truthy
    }
};
