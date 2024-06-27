// SPDX-FileCopyrightText: 2024 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const REQUIRED_PROPERTIES_MESSAGE = 'schema property must have the required property "properties"';
const REQUIRED_ADDITIONAL_PROPERTIES_MESSAGE = 'schema property must have the required property "additionalProperties"';
const PROPERTY_NAME_PROPERTIES = "properties";
const PROPERTY_NAME_ADDITIONAL_PROPERTIES = "additionalProperties";

module.exports = (schema, options, context) => {
  if (!schema.hasOwnProperty(PROPERTY_NAME_PROPERTIES) || !schema.hasOwnProperty(PROPERTY_NAME_ADDITIONAL_PROPERTIES)) {
    const result = verify(schema, context);
    return buildMessages(result);
  }
};

const buildMessages = (result) => {
  if (!result.hasProperties || !result.hasAdditionalProperties) {
    const messages = [];
    if (!result.hasProperties) {
      messages.push({ message: REQUIRED_PROPERTIES_MESSAGE });
    }
    if (!result.hasAdditionalProperties) {
      messages.push({ message: REQUIRED_ADDITIONAL_PROPERTIES_MESSAGE });
    }
    return messages;
  }
};

const verify = (schema, context) => {
  const result = [];

  const checkProperties = (schema, context) => {
    if (schema === undefined) {
      result.push({ hasProperties: false, hasAdditionalProperties: false });
      return;
    }
    if (schema.anyOf || schema.oneOf || schema.allOf) {
      ["anyOf", "oneOf", "allOf"].forEach((key) => {
        if (key in schema) {
          schema[key].forEach((subschema) => {
            checkProperties(subschema, context);
          });
        }
      });
    } else if (schema.$ref) {
      const nodeKey = Object.keys(context.documentInventory.graph.nodes).find((key) =>
        key.includes(schema.$ref.substring(schema.$ref.indexOf("/"))),
      );
      if (nodeKey) {
        checkProperties(context.documentInventory.graph.nodes[nodeKey].data, context);
      } else {
        result.push({ hasProperties: false, hasAdditionalProperties: false });
        return;
      }
    } else {
      const hasProperties = schema.hasOwnProperty(PROPERTY_NAME_PROPERTIES);
      const hasAdditionalProperties = schema.hasOwnProperty(PROPERTY_NAME_ADDITIONAL_PROPERTIES);
      result.push({ hasProperties, hasAdditionalProperties });
    }
  };

  checkProperties(schema, context);
  const hasProperties = result.every((item) => item.hasProperties === true);
  const hasAdditionalProperties = result.every((item) => item.hasAdditionalProperties === true);
  return {
    hasProperties,
    hasAdditionalProperties,
  };
};
