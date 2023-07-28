// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Ensure that both Basic & Bearer authentication is supported
 */

module.exports = (item, _, paths) => {
  const mandatorySchemes = ["basic", "bearer"];
  let schemeCount = 0;

  if (Object.keys(item).length === 0) {
    return [
      {
        message: `Reusable security scheme is not defined`,
      },
    ];
  }

  for (let key in item) {
    if (mandatorySchemes.includes(item[key].scheme)) {
      schemeCount++;
    }
  }

  if (schemeCount < mandatorySchemes.length - 1) {
    return [
      {
        message: `It's mandatory the following authentication types: ${mandatorySchemes}`,
      },
    ];
  }
};
