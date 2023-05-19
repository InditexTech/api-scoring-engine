const { asyncapi } = require("@stoplight/spectral-rulesets");
const rules = require("./rules");

module.exports = {
    extends: asyncapi,
    rules : {
        "contact-email" : rules.contactEmail,
        "contact-url" : rules.contactUrl,
        "mandatory-description" : rules.mandatoryDescription,
        "must-use-semantic-versioning" : rules.mustUseSemanticVersioning
    }
}