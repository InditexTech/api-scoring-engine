// SPDX-FileCopyrightText: 2025 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { ESLint } = require("eslint");
const graphqlPlugin = require("@graphql-eslint/eslint-plugin");
const path = require("path");
const { WARN_SEVERITY, ERROR_SEVERITY } = require("./severity");
const { configValue } = require("../config/config");
const GRAPHQL_FILE_EXTENSIONS = configValue("cerws.certification.protocol.GRAPHQL.file-extensions", [
  "graphql",
  "graphqls",
  "gql",
]);

const evaluateGraphqlApi = async (rootFolder, config) => {
  return await runEslint(
    rootFolder,
    {
      graphQLConfig: { schema: `${rootFolder}/**/*.{${GRAPHQL_FILE_EXTENSIONS.join(",")}}` },
      graphqlCustomConfig: config,
    },
    GRAPHQL_FILE_EXTENSIONS.map((ext) => `${rootFolder}/**/*.${ext}`),
  );
};

const evaluateGraphqlFile = async (file, config) => {
  return await runEslint(
    path.dirname(file),
    {
      graphQLConfig: { schema: file },
      graphqlCustomConfig: config,
    },
    [file],
  );
};

const runEslint = async (cwd, config, files) => {
  const plugins = {
    "@graphql-eslint": graphqlPlugin,
    ...config?.graphqlCustomConfig?.plugins,
  };

  let rules;
  if (config?.graphqlCustomConfig?.rulesConfig?.rules) {
    rules = config.graphqlCustomConfig.rulesConfig.rules;
  } else {
    rules = graphqlPlugin.configs["flat/schema-recommended"].rules;
  }

  const eslint = new ESLint({
    overrideConfigFile: true,
    allowInlineConfig: false,
    errorOnUnmatchedPattern: false,
    cwd,
    baseConfig: {
      files: GRAPHQL_FILE_EXTENSIONS.map((ext) => `**/*.${ext}`),
      languageOptions: {
        parser: graphqlPlugin.parser,
        parserOptions: {
          graphQLConfig: config.graphQLConfig,
        },
      },
      plugins,
      rules,
    },
  });

  const results = await eslint.lintFiles(files);

  results.forEach((file) => {
    file.messages.forEach((message) => {
      const customSeverity = config.graphqlCustomConfig?.rulesConfig?.severities[message.ruleId];
      message.customSeverity =
        typeof customSeverity === "number" ? customSeverity : message.severity === 1 ? WARN_SEVERITY : ERROR_SEVERITY;
    });
  });
  return results;
};

module.exports = {
  evaluateGraphqlApi,
  evaluateGraphqlFile,
};
