// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

module.exports = (input) => {
  if (
    input.schema === undefined ||
    input.schema.type === "object" ||
    // binary values are not basic values
    input.schema.format === "binary" ||
    // arrays can be skipped unless they are string arrays
    (input.schema.type === "array" && input.items && input.schema.items.type !== "string") ||
    // skip if the property as a reference
    input["$ref"] !== undefined ||
    input.allOf !== undefined ||
    // if this is a list
    input.oneOf !== undefined ||
    // allow an explicit example value of null
    input.example === null ||
    // allow an explicit example value of 0
    input.example === 0
  ) {
    return;
  }

  if (!input.example && input.example !== false) {
    return [
      {
        message: `"${input.name}.example" must be defined`,
      },
    ];
  }
};
