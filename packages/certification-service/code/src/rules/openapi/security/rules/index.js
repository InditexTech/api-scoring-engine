// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

module.exports = {
    allowedAuthMethods : require('./allowedAuthMethods'),
    allowedVerbs : require('./allowedVerbs'),
    arrayRequiredProperties : require('./arrayRequiredProperties'),
    emptySchema : require('./emptySchema'),
    emptySchemaHeaders : require('./emptySchemaHeaders'),
    ensureAuth : require('./ensureAuth'),
    ensureSecuritySchemes : require('./ensureSecuritySchemes'),
    globalSecurity : require('./globalSecurity'),
    implicitGrantOauth2 : require('./implicitGrantOauth2'),
    negotiateAuth : require('./negotiateAuth'),
    noAdditionalPropertiesDefined : require('./noAdditionalPropertiesDefined'),
    numericRequiredPropertiesMaxMin : require('./numericRequiredPropertiesMaxMin'),
    oauth1Auth : require('./oauth1Auth'),
    resourceOwnerPasswordAuth : require('./resourceOwnerPasswordAuth'),
    responseSchemaDefined : require('./responseSchemaDefined'),
    schemaMandatoryParameters : require('./schemaMandatoryParameters'),
    securityEmpty : require('./securityEmpty'),
    securityScopesDefined : require('./securityScopesDefined'),
    serverHttps : require('./serverHttps'),
    stringParametersRequiredMaxLength : require('./stringParametersRequiredMaxLength'),
    stringPropertiesRequiredMaxLength : require('./stringPropertiesRequiredMaxLength')
}