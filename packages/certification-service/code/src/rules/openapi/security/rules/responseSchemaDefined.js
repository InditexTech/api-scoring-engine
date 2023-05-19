const { truthy } = require("@stoplight/spectral-functions")

module.exports = {
    message: "Response {{property}} should contain a body",
    description: "You have not defined any schemas for responses that should contain a body. Only acceptable if the returned HTTP status code is 204 or 304 (no content allowed for these codes), see RFC 7231 and RFC 7232.",
    severity: "warn",
    given: "$..responses.[100,101,200,201,202,203,205,206,207,300,301,302,303,305,307,400,402,405,406,407,408,409,410,411,412,413,414,415,416,417,423,426,428,429,431,500,default]",
    then: {
        field: "content",
        function: truthy
    }
}
