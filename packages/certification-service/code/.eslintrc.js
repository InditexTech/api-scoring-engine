// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const prettierConfig = require("./prettier.config");

module.exports = {
  // Environment: node + ES2021
  env: {
    node: true,
    es2021: true,
  },

  parserOptions: {
    ecmaVersion: "latest",
  },

  // Set of linting rules
  plugins: ["prettier", "node", "jest"],
  extends: ["unobtrusive", "prettier"],

  // Basic rules fine tuning
  rules: {
    // Fail if the file is not prettified.
    // The framework prettier config is used.
    // https://github.com/prettier/eslint-plugin-prettier
    "prettier/prettier": ["error", prettierConfig],

    // console.log calls issue warnings
    // https://eslint.org/docs/rules/no-console
    "no-console": ["warn", { allow: ["warn", "error"] }],

    // debugger sentences issue errors
    // https://eslint.org/docs/rules/no-debugger
    "no-debugger": "error",

    // Allow ununsed vars as method params or prefixed by _
    "no-unused-vars": ["warn", { args: "none", varsIgnorePattern: "^_" }],

    // Node related rules
    // https://github.com/mysticatea/eslint-plugin-node
    // * Requires out of the global scope issue warnings
    // * Disallow deprecated APIs
    // * Disallow import declarations which import non-existant modules
    "node/global-require": "warn",
    "node/no-deprecated-api": "error",
    "node/no-missing-import": "error",
  },

  overrides: [
    {
      // Rules only applied to test files
      files: ["test/**/*.js"],

      // Allow jest globals: jest, expect, it, test, etc.
      env: {
        "jest/globals": true,
      },

      // Recommended rules for jest tests
      // https://github.com/jest-community/eslint-plugin-jest#rules
      rules: {
        "jest/expect-expect": "warn",
        "jest/no-alias-methods": "warn",
        "jest/no-commented-out-tests": "warn",
        "jest/no-deprecated-functions": "error",
        "jest/no-disabled-tests": "error",
        "jest/no-done-callback": "error",
        "jest/no-duplicate-hooks": "error",
        "jest/no-export": "error",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/no-if": "error",
        "jest/no-interpolation-in-snapshots": "error",
        "jest/no-jasmine-globals": "error",
        "jest/no-jest-import": "error",
        "jest/no-standalone-expect": "error",
        "jest/no-test-return-statement": "error",
        "jest/prefer-comparison-matcher": "error",
        "jest/prefer-equality-matcher": "error",
        "jest/prefer-spy-on": "warn",
        "jest/prefer-strict-equal": "warn",
        "jest/prefer-to-be": "error",
        "jest/prefer-to-contain": "error",
        "jest/prefer-to-have-length": "error",
        "jest/prefer-todo": "error",
        "jest/require-to-throw-message": "error",
        "jest/require-top-level-describe": "error",
        "jest/valid-describe-callback": "error",
        "jest/valid-expect": "error",
        "jest/valid-title": "error",
      },
    },
  ],
};
