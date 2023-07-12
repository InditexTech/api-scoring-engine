// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const rules = require("./rules")

module.exports = {
    rules : {
        "allowed-auth-methods" : rules.allowedAuthMethods,
        "allowed-verbs" : rules.allowedVerbs,
        "array-required-properties" : rules.arrayRequiredProperties,
        "empty-schema" : rules.emptySchema,
        "empty-schema-headers" : rules.emptySchemaHeaders,
        "ensure-auth" : rules.ensureAuth,
        "ensure-security-schemes" : rules.ensureSecuritySchemes,
        "global-security" : rules.globalSecurity,
        "implicit-grant-oauth2" : rules.implicitGrantOauth2,
        "negotiate-auth" : rules.negotiateAuth,
        "no-additional-properties-defined" : rules.noAdditionalPropertiesDefined,
        "numeric-required-properties-max-min" : rules.numericRequiredPropertiesMaxMin,
        "oauth1-auth" : rules.oauth1Auth,
        "resource-owner-password-auth" : rules.resourceOwnerPasswordAuth,
        "response-schema-defined" : rules.responseSchemaDefined,
        "schema-mandatory-parameters" : rules.schemaMandatoryParameters,
        "security-empty" : rules.securityEmpty,
        "security-scopes-defined" : rules.securityScopesDefined,
        "server-https" : rules.serverHttps,
        "string-parameters-required-max-length" : rules.stringParametersRequiredMaxLength,
        "string-properties-required-max-length" : rules.stringPropertiesRequiredMaxLength
    }
}