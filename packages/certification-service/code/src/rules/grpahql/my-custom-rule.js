// SPDX-FileCopyrightText: 2025 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

module.exports = {
  create(context) {
    return {
      ["FieldDefinition"](node) {
        const fieldName = node.name?.value;

        if ("executeExampleMethod" === fieldName) {
          const parentName = node.parent.name.value;
          console.error(`The field \`${parentName}.${fieldName}\` has no valid name!`);
          context.report({
            node,
            message: `The field \`${parentName}.${fieldName}\` has no valid name!`,
          });
        }
      },
    };
  },
};
