// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

/**
 * OAuth2 security requirement requires a scope not declared in the referenced security scheme
 */

function isSubset(arr1, arr2, m, n) {
  let i = 0;
  let j = 0;
  for (i = 0; i < n; i++) {
    for (j = 0; j < m; j++) {
      if (arr2[i] == arr1[j]) {
        break;
      }
    }

    if (j == m) {
      return false;
    }
  }
  return true;
}

module.exports = (item, _, paths) => {
  const OAUTH2 = "oauth2";
  const result = [];

  let securityScopes = [];
  let securitySchemesScopes = [];

  if (typeof item.security == "undefined" || item.security.length == 0) {
    return result;
  }

  for (let key in item.security) {
    const authMethod = Object.keys(item.security[key]).toString();

    if (authMethod.toLowerCase().includes(OAUTH2)) {
      securityScopes = item.security[key][authMethod];
    }
  }

  if (securityScopes.length == 0) {
    return result;
  }

  for (let key in item.components.securitySchemes) {
    if (key.toLowerCase().includes(OAUTH2)) {
      securitySchemesScopes = Object.keys(item.components.securitySchemes[key].flows.authorizationCode.scopes);
    }
  }

  if (!isSubset(securitySchemesScopes, securityScopes, securitySchemesScopes.length, securityScopes.length)) {
    result.push({
      message: `There are scopes in use on security but not declared on the Security Schemes: ${securityScopes.toString()}`,
      path: ["security"],
    });
  }

  return result;
};
