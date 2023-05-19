/**
 * Ensure that examples exist for paramters/properties of
 * basic values
 */

module.exports = (input) => {
  if (
    input.type === "object" ||
    // binary values are not basic values
    input.format === "binary" ||
    // arrays can be skipped unless they are string arrays
    (input.type === "array" && input.items && input.items.type !== "string") ||
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
        message: `${input} is not truthy`,
      },
    ];
  }
};
