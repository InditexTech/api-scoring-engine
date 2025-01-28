const prettier = require("eslint-plugin-prettier");
const jest = require("eslint-plugin-jest");
const globals = require("globals");
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname, // optional
  recommendedConfig: js.configs.recommended, // optional unless using "eslint:recommended"
  allConfig: js.configs.all,
});

module.exports = [
  {
     ignores: ["src/rules/**/*.*"],
  },
  ...compat.extends("unobtrusive", "prettier"),
  {
   
    plugins: {
      prettier,
      jest,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: "latest",
      sourceType: "commonjs",
    },

    rules: {
      "prettier/prettier": [
        "error",
        {
          printWidth: 120,
          trailingComma: "all",
          singleQuote: false,
        },
      ],

      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],

      "no-debugger": "error",

      "no-unused-vars": [
        "warn",
        {
          args: "none",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["test/**/*.js"],

    languageOptions: {
      globals: {
        ...jest.environments.globals.globals,
      },
    },

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

      "jest/no-interpolation-in-snapshots": "error",
      "jest/no-jasmine-globals": "error",
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
];
