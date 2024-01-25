// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { configValue } = require("../config/config");
const { AppError } = require("../utils/error");
const { httpStatusCodes } = require("../utils/httpStatusCodes");

const { parseYaml } = require("../utils/yamlUtils");
const { WARN_SEVERITY } = require("../evaluate/severity");
const path = require("path");

const configFileName = path.join(process.cwd(), configValue("cerws.lint.grpc.severities-file"));

const formatProtolint = (protolintViolations) => {
  const configFile = parseYaml(configFileName);
  const violations = parseJSON(protolintViolations);

  let formatted = [];
  const lints = violations.lints;
  if (lints) {
    formatted = lints.map((issue) => {
      issue["fileName"] = issue["filename"];
      delete issue["filename"];
      return issue;
    });
  }

  if (configFile && configFile.global) {
    formatted.forEach((issue) => {
      const severity = configFile.global.rules.severities.filter((x) => x.id === issue.rule);
      if (severity.length > 0) {
        issue.severity = severity[0].severity;
      } else {
        issue.severity = WARN_SEVERITY;
      }
    });
  } else {
    formatted.forEach((issue) => {
      issue.severity = WARN_SEVERITY;
    });
  }
  return formatted;
};

const parseJSON = (protolintOutput) => {
  let jsonOutput;

  try {
    jsonOutput = JSON.parse(protolintOutput);
  } catch (e) {
    throwError(protolintOutput);
  }

  return jsonOutput;
};

const throwError = (protolintOutput) => {
  throw new AppError({
    code: httpStatusCodes.HTTP_INTERNAL_SERVER_ERROR,
    message: `Protolint output "${protolintOutput}" is not valid JSON.`,
    status: httpStatusCodes.HTTP_INTERNAL_SERVER_ERROR,
  });
};

module.exports = { formatProtolint };
