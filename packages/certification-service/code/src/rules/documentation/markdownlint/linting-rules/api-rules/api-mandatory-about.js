// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

// @ts-check
"use strict";

const sectionName = "about";

module.exports = {
  names: ["EX_MD050", "custom-mandatory-about"],
  description: "Mandatory About Section",
  tags: ["Sections"],
  function: function rule(params, onError) {
    let headerExists = false;
    params.tokens
      .filter(function filterToken(token) {
        return token.type === "inline";
      })
      .forEach(function forToken(inline) {
        inline.children
          .filter(function filterChild(child) {
            return child.type === "text";
          })
          .forEach(function forChild(text) {
            if (text.line.startsWith("#")) {
              if (text.line.trim().toLowerCase().includes(sectionName)) {
                headerExists = true;
              }
            }
          });
      });
    if (!headerExists) {
      onError({
        lineNumber: 1,
        context: `Section '${sectionName}' must exist`,
      });
    }
  },
};
