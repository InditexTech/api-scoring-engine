// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { oas } = require('@stoplight/spectral-rulesets');
const rules = require('./rules');

module.exports = {
    extends: oas,
    rules : {
        "oas3-api-servers": false,
        "contact-url" : rules.contactUrl,
        "contact-email" : rules.contactEmail,
        "openapi-version" : rules.openapiVersion,
        "error-response-definitions" : rules.errorResponseDefinitions,
        "must-use-semantic-versioning" : rules.mustUseSemanticVersioning,
        "ensure-operations-summary" : rules.ensureOperationsSummary,
        "paths-param-examples" : rules.pathsParamExamples,
        "components-param-examples" : rules.componentsParamExamples,
        "ensure-properties-examples" : rules.ensurePropertiesExamples,
        "paths-uppercase" : rules.pathsUppercase,
        "paths-no-underscore" : rules.pathsNoUnderscore,
        "path-parameters-camel-case" : rules.pathParametersCamelCase,
        "query-camel-case" : rules.queryCamelCase,
        "camel-case-for-properties" : rules.camelCaseForProperties,
        "dto-schema-name" : rules.dtoSchemaName,
        "delete-http-status-codes-resource" : rules.deleteHttpStatusCodesResource,
        "error-response-definitions-rfc7807-status" : rules.errorResponseDefinitionsRfc7807Status,
        "get-http-status-codes-collections" : rules.getHttpStatusCodesCollections,
        "get-http-status-codes-resource" : rules.getHttpStatusCodesCollections,
        "patch-http-status-code-resource" : rules.patchHttpStatusCodeResource,
        "post-http-status-codes-collections" : rules.postHttpStatusCodesCollections,
        "post-http-status-codes-controller" : rules.postHttpStatusCodesController,
        "post-http-status-codes-resource" : rules.postHttpStatusCodesResource,
        "well-understood-http-status-codes" : rules.wellUnderstoodHttpStatusCodes,
        "put-http-status-codes-resource" : rules.putHttpStatusCodesResource,
        "standard-http-status-codes" : rules.standardHttpStatusCodes
    }
}