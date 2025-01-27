// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const path = require("path");
const { LintRuleset } = require("../evaluate/lint/lintRuleset");
const { REST, EVENT, GRPC, GRAPHQL } = require("../evaluate/lint/protocols");
const {
  VALIDATION_TYPE_DESIGN,
  VALIDATION_TYPE_DOCUMENTATION,
  VALIDATION_TYPE_SECURITY,
  VALIDATION_TYPE_OVERALL_SCORE,
  SCORES_WEIGHTS_BY_VALIDATION_TYPE,
  SCORES_WEIGHTS_BY_VALIDATION_TYPE_WITHOUT_SECURITY,
  API_PROTOCOL,
  NUMBER_OF_GRPC_RULES,
} = require("./types.js");
const { calculateRating } = require("../scoring/grades");
const {
  scoreLinting,
  scoreMarkdown,
  scoreGRPCLinting,
  arrayIsNotEmpty,
  calculateAverageScore,
} = require("../scoring/scoring");
const { getAppLogger } = require("../log");
const { RestLinter } = require("./restLinter");
const { EventLinter } = require("./eventLinter");
const { gRPCLinter } = require("./grpcLinter");
const { DocumentationLinter } = require("./documentationLinter");
const { DocumentationRuleset } = require("../evaluate/documentation/documentationRuleset");
const { GraphqlLinter } = require("./graphqlLinter.js");

const logger = getAppLogger();

const validateApi = async (apiDir, tempDir, api, validationType) => {
  const apiProtocol = api["api-spec-type"].toUpperCase();
  logger.info(`Validating API '${api.name}/${apiProtocol}'`);
  const fileName = path.join(api["definition-path"], getApiFile(api, apiProtocol)).replace(/\\/g, "/");
  const file = path.join(apiDir, getApiFile(api, apiProtocol));

  validationType = validationType === VALIDATION_TYPE_OVERALL_SCORE ? null : validationType;

  let apiValidation = {
    validationDateTime: new Date().toISOString(),
    apiName: api.name,
    apiVersion: api.version,
    apiProtocol: API_PROTOCOL[apiProtocol],
    result: [],
    score: 0,
    rating: "D",
    ratingDescription: "",
    hasErrors: false,
  };

  const design = {
    designValidation: {
      validationType: VALIDATION_TYPE_DESIGN,
      issues: [],
      spectralValidation: { issues: [] },
      protolintValidation: { issues: [] },
    },
  };
  const security = {
    securityValidation: {
      validationType: VALIDATION_TYPE_SECURITY,
      spectralValidation: { issues: [] },
      protolintValidation: { issues: [] },
    },
  };
  const documentation = { documentationValidation: { validationType: VALIDATION_TYPE_DOCUMENTATION, issues: [] } };

  const graphqlLinter = new GraphqlLinter();
  if (apiProtocol === REST) {
    await RestLinter.lintRest({
      validationType,
      file,
      fileName,
      apiValidation,
      design,
      security,
      tempDir,
    });
  } else if (apiProtocol === EVENT) {
    await EventLinter.lintEvent({ file, validationType, fileName, apiDir, tempDir, apiValidation, design });
  } else if (apiProtocol === GRPC) {
    await gRPCLinter.lintgRPC(validationType, apiDir, tempDir, design, new Map());
  } else if (apiProtocol === GRAPHQL) {
    await graphqlLinter.lint(validationType, apiDir, tempDir, design);
    design.designValidation.spectralValidation.issues = design.designValidation.issues.map((i) => {
      i.source = i.fileName;
      return i;
    });
  }

  await DocumentationLinter.lintDocumentation(validationType, tempDir, api, documentation);

  // Modules Scoring and Rating
  design.designValidation.score = scoreLinterValidations(design, apiProtocol);

  security.securityValidation.score = scoreLinting(
    security.securityValidation.spectralValidation.issues,
    LintRuleset.REST_SECURITY.numberOfRules,
  );

  documentation.documentationValidation.score = scoreMarkdown(
    documentation.documentationValidation.issues,
    DocumentationRuleset.numberOfAllCustomRules(),
  );
  Object.assign(design.designValidation, calculateRating(design.designValidation.score));
  Object.assign(security.securityValidation, calculateRating(security.securityValidation.score));
  Object.assign(documentation.documentationValidation, calculateRating(documentation.documentationValidation.score));

  if (apiProtocol === EVENT || apiProtocol === GRPC || apiProtocol === GRAPHQL) {
    apiValidation.result = [design, documentation];
  } else {
    apiValidation.result = [design, security, documentation];
  }
  if (validationType) {
    // remove empty validation results when not all validation types are requested
    function findValidationType(r) {
      return Object.values(r).find((v) => v.hasOwnProperty("validationType")).validationType;
    }
    apiValidation.result = apiValidation.result.filter((r) => findValidationType(r) === validationType);
  }
  logger.info(`Calculating API rating for '${api.name}/${apiProtocol}'`);
  if (apiProtocol === REST) {
    apiValidation.score = calculateAverageScore(
      [
        [design.designValidation.score, VALIDATION_TYPE_DESIGN],
        [documentation.documentationValidation.score, VALIDATION_TYPE_DOCUMENTATION],
        [security.securityValidation.score, VALIDATION_TYPE_SECURITY],
      ],
      SCORES_WEIGHTS_BY_VALIDATION_TYPE,
    );
  } else {
    apiValidation.score = calculateAverageScore(
      [
        [design.designValidation.score, VALIDATION_TYPE_DESIGN],
        [documentation.documentationValidation.score, VALIDATION_TYPE_DOCUMENTATION],
      ],
      SCORES_WEIGHTS_BY_VALIDATION_TYPE_WITHOUT_SECURITY,
    );
  }

  Object.assign(apiValidation, calculateRating(apiValidation.score));

  return apiValidation;
};

function scoreLinterValidations(design, apiProtocol) {
  const numberOfRules = resolveNumberOfRulesByProtocol(apiProtocol);
  const spectralIssues = design.designValidation.spectralValidation.issues;
  const grpcIssues = design.designValidation.protolintValidation.issues;

  return arrayIsNotEmpty(spectralIssues)
    ? scoreLinting(spectralIssues, numberOfRules)
    : scoreGRPCLinting(grpcIssues, NUMBER_OF_GRPC_RULES);
}

function resolveNumberOfRulesByProtocol(protocol) {
  let numberOfRules;

  if (protocol == EVENT) {
    numberOfRules = LintRuleset.EVENT_GENERAL.numberOfRules + LintRuleset.AVRO_GENERAL.numberOfRules;
  } else {
    numberOfRules = LintRuleset.REST_GENERAL.numberOfRules;
  }

  return numberOfRules;
}

function getApiFile(api, apiProtocol) {
  if (api["definition-file"]) {
    return api["definition-file"];
  }
  if (apiProtocol === EVENT) {
    return "asyncapi.yml";
  }

  return "openapi-rest.yml";
}

module.exports = { validateApi };
