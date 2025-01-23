// SPDX-FileCopyrightText: 2025 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { ESLint } = require("eslint");
const graphqlPlugin = require("@graphql-eslint/eslint-plugin");
const path = require("path");

const evaluateGraphqlRepo = async (rootFolder) => {
  return await runEslint(rootFolder, { schema: `${rootFolder}/**/*.{graphql,graphqls,gql}` }, [
    `${rootFolder}/**/*.graphql`,
    `${rootFolder}/**/*.graphqls`,
    `${rootFolder}/**/*.gql`,
  ]);
};

const evaluateGraphqlFile = async (file) => {
  return await runEslint(path.dirname(file), { schema: file }, [file]);
};

const runEslint = async (cwd, graphQLConfig, files) => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    allowInlineConfig: false,
    errorOnUnmatchedPattern: false,
    cwd,
    baseConfig: {
      files: ["**/*.graphql", "**/*.graphqls", "**/*.gql"],
      languageOptions: {
        parser: graphqlPlugin.parser,
        parserOptions: {
          graphQLConfig,
        },
      },
      plugins: {
        "@graphql-eslint": graphqlPlugin,
      },
      rules: {
        ...graphqlPlugin.configs["flat/schema-all"].rules,
      },
    },
  });
  let results;
  try {
    // results = await eslint.lintFiles(`${rootFolder}`);
    results = await eslint.lintFiles(files);
  } catch (e) {
    // const results = await eslint.lintFiles(`${rootFolder}/**/*.graphql`);
    console.error(e);
  }

  const formatter = await eslint.loadFormatter("json");
  const formattedResults = formatter.format(results);
  return JSON.parse(formattedResults);
};
module.exports = {
  evaluateGraphqlRepo,
  evaluateGraphqlFile,
};
