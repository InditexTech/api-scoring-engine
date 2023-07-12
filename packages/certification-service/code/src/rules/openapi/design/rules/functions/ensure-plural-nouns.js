// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const inflection = require("inflection");

const VERBS = ["allow", "make", "open", "begin", "write", "convert", "set", "read", "fetch", "take", "give", "find"];

// Based on https://github.com/istreamlabs/rest-api-lint/blob/master/isp-functions/noun-deps.js
// The noun function takes the name of something and returns an error if it
module.exports = (targetValue) => {
  const errors = [];

  // Split into path pieces ignoring blank/empty ones and params.
  let pieces = targetValue.split("/").filter((i) => !!i);

  if ((pieces.length === 1 && pieces[0] === "search") || pieces[0] === "me") {
    // Top-level exceptions. Skip.
    return;
  }

  // No piece should contain verbs.
  for (const value of pieces) {
    if (value.startsWith("{")) continue;

    // Test each verb to see if the value matches or begins with it. The
    // regex below is to prevent e.g. `giver` from triggering the error
    // since it is a noun that begins with a verb.
    for (const verb of VERBS) {
      if (
        (value.length === verb.length && value === verb) ||
        (value.length > verb.length && value.startsWith(verb) && value[verb.length].match(/[ -_A-Z]/))
      ) {
        errors.push({
          message: `${value} should be a noun`,
        });
      }
    }
  }

  for (const value of pieces) {
    if (value.startsWith("{")) continue;

    // this does not need to be plural
    if (value.match(/v[0-9]+/)) continue;

    // Ensure words are plural if later paths exist.
    const plural = inflection.pluralize(value);
    if (value !== plural) {
      errors.push({
        message: `${value} should be plural: ${plural}`,
      });
    }
  }
  return errors;
};
