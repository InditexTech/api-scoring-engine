const defaultConfig = {
  // Enable node support
  testEnvironment: "node",

  // Test all files in the "test" folder either suffixed with "-test.js" or having ".test.js" extensions
  testRegex: "/test/.*[-.]test\\.js?$",

  // Ignore Yarn caché if present in the project folder
  modulePathIgnorePatterns: ["<rootDir>/.yarn_cache"],

  // Do not generate coverage reports by default. Use the CLI --coverage option to force
  collectCoverage: false,

  // Dump coverage reports on "coverage" folder
  coverageDirectory: "coverage",

  // Paths to be analyzed for code coverage
  collectCoverageFrom: ["src/**/*.js", "!src/rules/**"],

  // Generate coverage reports in text, html, lcov and clover format
  coverageReporters: ["text", "html", "lcov", "clover"],

  // Use default
  reporters: ["default"],

  // Avoids infinite loops when running jest with the --watch option.
  // test-report.json (jest-bamboo-reporter) is regenerated each time a test is executed.
  watchPathIgnorePatterns: ["<rootDir>/test-report.json"],
};

const moduleNameMapper = {
  "^nimma/legacy$": "<rootDir>/node_modules/nimma/dist/legacy/cjs/index.js",
  "^nimma/(.*)": "<rootDir>/node_modules/nimma/dist/cjs/$1",
  "^nimma/fallbacks$": "<rootDir>/node_modules/nimma/dist/legacy/cjs/fallbacks/index.js",
  "^@stoplight/spectral-ruleset-bundler/with-loader":
    "<rootDir>/node_modules/@stoplight/spectral-ruleset-bundler/dist/loader/node.js",
  "^@stoplight/spectral-ruleset-bundler/plugins/builtins":
    "<rootDir>/node_modules/@stoplight/spectral-ruleset-bundler/dist/plugins/builtins.js",
};

module.exports = {
  ...defaultConfig,
  moduleNameMapper,
  testTimeout: 60000,
};
