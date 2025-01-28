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
const { scoreLinting, scoreMarkdown, calculateAverageScore } = require("../scoring/scoring");
const { getAppLogger } = require("../log");
const { RestLinter } = require("./restLinter");
const { EventLinter } = require("./eventLinter");
const { gRPCLinter } = require("./grpcLinter");
const { DocumentationLinter } = require("./documentationLinter");
const { DocumentationRuleset } = require("../evaluate/documentation/documentationRuleset");
const { GraphqlLinter } = require("./graphqlLinter.js");
const { checkForErrors } = require("./utils.js");

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
      validationIssues: [],
      spectralValidation: { issues: [] },
      protolintValidation: { issues: [] },
    },
  };
  const security = {
    securityValidation: {
      validationType: VALIDATION_TYPE_SECURITY,
      validationIssues: [],
      spectralValidation: { issues: [] },
      protolintValidation: { issues: [] },
    },
  };
  const documentation = {
    documentationValidation: { validationType: VALIDATION_TYPE_DOCUMENTATION, issues: [], validationIssues: [] },
  };

  let numberOfDesignRules;

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
    numberOfDesignRules = LintRuleset.REST_GENERAL.numberOfRules;
  } else if (apiProtocol === EVENT) {
    await EventLinter.lintEvent({ file, validationType, fileName, apiDir, tempDir, apiValidation, design });
    numberOfDesignRules = LintRuleset.EVENT_GENERAL.numberOfRules + LintRuleset.AVRO_GENERAL.numberOfRules;
  } else if (apiProtocol === GRPC) {
    await gRPCLinter.lintgRPC(validationType, apiDir, tempDir, design, new Map());
    numberOfDesignRules = NUMBER_OF_GRPC_RULES;
  } else if (apiProtocol === GRAPHQL) {
    const graphqlLinter = new GraphqlLinter();
    await graphqlLinter.lint(validationType, apiDir, tempDir, design);

    design.designValidation.spectralValidation.issues = design.designValidation.validationIssues.map((i) => {
      return {
        ...i,
        source: i.fileName,
      };
    });
    numberOfDesignRules = graphqlLinter.numberOfRulesExclidingInfoSeverity;
  }

  await DocumentationLinter.lintDocumentation(validationType, tempDir, api, documentation);
  
  apiValidation.hasErrors = checkForErrors(apiValidation, [
    ...design.designValidation.validationIssues,
    ...security.securityValidation.validationIssues,
    ...documentation.documentationValidation.validationIssues,
  ]);

  // Modules Scoring and Rating
  design.designValidation.score = scoreLinting(design.designValidation.validationIssues, numberOfDesignRules);

  security.securityValidation.score = scoreLinting(
    security.securityValidation.validationIssues,
    LintRuleset.REST_SECURITY.numberOfRules,
  );

  documentation.documentationValidation.score = scoreMarkdown(
    documentation.documentationValidation.validationIssues,
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
