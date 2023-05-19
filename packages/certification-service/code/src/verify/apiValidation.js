const path = require("path");
const { LintRuleset } = require("../evaluate/lint/lintRuleset");
const { REST, EVENT, GRPC } = require("../evaluate/lint/protocols");
const {
  VALIDATION_TYPE_DESIGN,
  VALIDATION_TYPE_DOCUMENTATION,
  VALIDATION_TYPE_SECURITY,
  VALIDATION_TYPE_OVERALL_SCORE,
  SCORES_WEIGHTS_BY_VALIDATION_TYPE,
  SCORES_WEIGHTS_BY_VALIDATION_TYPE_WITHOUT_SECURITY,
  API_PROTOCOL,
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

const logger = getAppLogger();

const validateApi = async (rootFolder, api, validationType, isVerbose, tempFolder) => {
  const apiProtocol = api["api-spec-type"].toUpperCase();
  logger.info(`Validating API '${api.name}/${apiProtocol}'`);
  const fileName = path.join(api["definition-path"], getApiFile(api, apiProtocol)).replace(/\\/g, "/");
  let file;
  if (tempFolder) {
    file = path.join(tempFolder, getApiFile(api, apiProtocol));
    tempFolder = file;
  } else {
    file = path.join(rootFolder, api["definition-path"], getApiFile(api, apiProtocol));
  }

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

  if (apiProtocol === REST) {
    await RestLinter.lintRest({
      validationType,
      file,
      fileName,
      rootFolder,
      apiValidation,
      design,
      security,
      tempFolder,
    });
  } else if (apiProtocol === EVENT) {
    await EventLinter.lintEvent({ file, validationType, fileName, rootFolder, apiValidation, design, api });
  } else if (apiProtocol === GRPC) {
    await gRPCLinter.lintgRPC(validationType, rootFolder, api, design, new Map());
  }

  await DocumentationLinter.lintDocumentation(validationType, rootFolder, api, documentation);

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

  if (apiProtocol === EVENT || apiProtocol === GRPC) {
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

  return arrayIsNotEmpty(spectralIssues) ? scoreLinting(spectralIssues, numberOfRules) : scoreGRPCLinting(grpcIssues);
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
