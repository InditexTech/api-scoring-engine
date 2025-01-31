// SPDX-FileCopyrightText: 2025 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const graphqlPlugin = require("@graphql-eslint/eslint-plugin");
const { WARN_SEVERITY } = require("../../../evaluate/severity");

module.exports = {
  rules: {
    ...graphqlPlugin.configs["flat/schema-recommended"].rules,
  },
  severities: {
    // https://the-guild.dev/graphql/eslint/rules
    "@graphql-eslint/description-style": WARN_SEVERITY,
    "@graphql-eslint/known-argument-names": WARN_SEVERITY,
    "@graphql-eslint/known-directives": WARN_SEVERITY,
    "@graphql-eslint/known-type-names": WARN_SEVERITY,
    "@graphql-eslint/lone-schema-definition": WARN_SEVERITY,
    "@graphql-eslint/naming-convention": WARN_SEVERITY,
    "@graphql-eslint/no-hashtag-description": WARN_SEVERITY,
    "@graphql-eslint/no-typename-prefix": WARN_SEVERITY,
    "@graphql-eslint/no-unreachable-types": WARN_SEVERITY,
    "@graphql-eslint/possible-type-extension": WARN_SEVERITY,
    "@graphql-eslint/provided-required-arguments": WARN_SEVERITY,
    "@graphql-eslint/require-deprecation-reason": WARN_SEVERITY,
    "@graphql-eslint/require-description": WARN_SEVERITY,
    "@graphql-eslint/strict-id-in-types": WARN_SEVERITY,
    "@graphql-eslint/unique-directive-names": WARN_SEVERITY,
    "@graphql-eslint/unique-directive-names-per-location": WARN_SEVERITY,
    "@graphql-eslint/unique-enum-value-names": WARN_SEVERITY,
    "@graphql-eslint/unique-field-definition-names": WARN_SEVERITY,
    "@graphql-eslint/unique-operation-types": WARN_SEVERITY,
    "@graphql-eslint/unique-type-names": WARN_SEVERITY,
  },
};
