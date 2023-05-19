const {
    truthy,
} = require("@stoplight/spectral-functions");

module.exports = {
    message: "Missing the {{property}}",
    description: "Put a summary in all operations [39]",
    severity: "warn",
    given: "$.paths.*[get,post,patch,put,delete]",
    then: [
        {
            field: "summary",
            function: truthy
        }
    ]
};
