// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { NUMBER_OF_BASE_RULES } = require("../evaluate/documentation/documentationRuleset");
const { ERROR_SEVERITY, INFO_SEVERITY } = require("../evaluate/severity");
const { configValue } = require("../config/config");
const { getAppLogger } = require("../log");
const { CUSTOM_RULES_NAMES } = require("../verify/documentationLinter");

const MARKDOWN_BASE_RULES = "MARKDOWN_BASE_RULES";
const MARKDOWN_CUSTOM_RULES = "MARKDOWN_CUSTOM_RULES";
const ERROR_COEFFICIENT_PROPORTION = configValue("cerws.certification.scoring.error-coefficient-weight");
const CUSTOM_RULE_PREFIXES = configValue("cerws.markdown.custom-rule-prefixes");

const logger = getAppLogger();

const scoreLinting = (evaluationData, numberOfRules) => {
  const uniqueFailedRules = filterRepeatedAndSuggestionInfractions(evaluationData, "code");
  const numberOfFailedErrorRules = filterErrorRules(uniqueFailedRules).length;
  const numberOfFailedRules = uniqueFailedRules.length;

  return calculateScore(numberOfFailedRules, numberOfRules, numberOfFailedErrorRules);
};

const scoreGRPCLinting = (evaluationData, numberOfRules) => {
  if (evaluationData.find((issue) => issue.rule === "PROTOLINT_FAILED")) {
    return 0;
  }
  const uniqueFailedRules = filterRepeatedAndSuggestionInfractions(evaluationData, "rule");
  const numberOfFailedErrorRules = filterErrorRules(uniqueFailedRules).length;

  const numberOfFailedRules = uniqueFailedRules.length;

  return calculateScore(numberOfFailedRules, numberOfRules, numberOfFailedErrorRules);
};

const scoreMarkdown = (markdownEvaluationData, numberOfAllCustomRules) => {
  if (missinOrInvalidReadmeError(markdownEvaluationData)) {
    return 0;
  }
  const uniqueInfractions = filterRepeatedAndSuggestionInfractions(markdownEvaluationData, "ruleNames");
  const { customRulesFailed, baseRulesFailed } = filterCustomMarkdownRules(uniqueInfractions);
  const numberOfCustomRulesFailed = customRulesFailed.length;
  const numberOfCustomRulesErrorsFailed = filterErrorRules(customRulesFailed).length;
  const numberOfBaseRulesErrorsFailed = filterErrorRules(baseRulesFailed).length;
  const numberOfBaseRulesFailed = baseRulesFailed.length;

  return calculateAverageScore(
    [
      [
        calculateScore(numberOfBaseRulesFailed, NUMBER_OF_BASE_RULES, numberOfBaseRulesErrorsFailed),
        MARKDOWN_BASE_RULES,
      ],
      [
        calculateScore(numberOfCustomRulesFailed, numberOfAllCustomRules, numberOfCustomRulesErrorsFailed),
        MARKDOWN_CUSTOM_RULES,
      ],
    ],
    SCORES_WEIGHTS_BY_RULE_TYPE,
  );
};

const missinOrInvalidReadmeError = (markdownEvaluationData) => {
  return markdownEvaluationData.find(
    (o) =>
      o.ruleNames.includes(CUSTOM_RULES_NAMES.README_MUST_EXISTS) ||
      o.ruleNames.includes(CUSTOM_RULES_NAMES.README_MUST_HAVE_CONTENT),
  );
};

const filterErrorRules = (evaluationData) => {
  return evaluationData.filter((violation) => {
    return violation.severity == ERROR_SEVERITY;
  });
};

const calculateScore = (numberOfFailedRules, numberOfRules, numberOfFailedErrorRules) => {
  let finalScore = 0;
  if (numberOfRules >= numberOfFailedRules) {
    finalScore = 100 - calculateViolations(numberOfFailedRules, numberOfRules, numberOfFailedErrorRules).toFixed(2);
  }

  logger.debug(`Final score is ${finalScore}`);

  return Math.max(finalScore, 0);
};

const calculateCoefficientProportion = (numberOfRules) => {
  return (1 / numberOfRules) * ERROR_COEFFICIENT_PROPORTION;
};

const calculateViolations = (numberOfFailedRules, numberOfRules, numberOfFailedErrorRules) => {
  const numberOfWarningFailedRules = numberOfFailedRules - numberOfFailedErrorRules;

  return (
    (calculateWarningWeight(numberOfWarningFailedRules, numberOfRules) +
      calculateErrorWeight(numberOfFailedErrorRules, numberOfRules)) *
    100
  );
};

const calculateWarningWeight = (numberOfWarningFailedRules, numberOfRules) => {
  return numberOfWarningFailedRules / numberOfRules;
};

const calculateErrorWeight = (numberOfFailedErrorRules, numberOfRules) => {
  const coefficientProportion = calculateCoefficientProportion(numberOfRules);
  return numberOfFailedErrorRules * coefficientProportion;
};

const filterRepeatedAndSuggestionInfractions = (evaluationData, field) => {
  let lookup = {};
  let result = [];
  let items = evaluationData;

  items.forEach((item) => {
    let rule = item[field];
    let severity = item["severity"];

    if (severity !== INFO_SEVERITY && !(rule in lookup)) {
      lookup[rule] = 1;
      result.push(item);
    }
  });

  logger.debug(`Number of unique infractions and excluding info level is ${result.length}`);

  return result;
};

const filterCustomMarkdownRules = (evaluationData) => {
  let baseRulesFailed = [];
  let customRulesFailed = [];
  let items = evaluationData;

  items.forEach((item) => {
    let ruleName = item["ruleNames"][1];
    if (isCustomRule(ruleName)) {
      customRulesFailed.push(item);
    } else {
      baseRulesFailed.push(item);
    }
  });

  logger.debug(`Number of custom rule infractions is ${customRulesFailed.length}`);

  return { customRulesFailed, baseRulesFailed };
};

const isCustomRule = (ruleName) => {
  return CUSTOM_RULE_PREFIXES.some((prefix) => ruleName.startsWith(prefix));
};

const arrayIsNotEmpty = (array) => {
  return array && array.length;
};

function calculateAverageScore(results, scoreWeightTable) {
  const score = results.reduce((apiScore, [score, validationType]) => {
    const scoreWeight = scoreWeightTable[validationType];
    return apiScore + (score || 0) * scoreWeight;
  }, 0);

  return Math.floor(score * 100) / 100;
}

const SCORES_WEIGHTS_BY_RULE_TYPE = {
  MARKDOWN_BASE_RULES: configValue("cerws.markdown.scoring.rules-weights.base-rules"),
  MARKDOWN_CUSTOM_RULES: configValue("cerws.markdown.scoring.rules-weights.custom-rules"),
};

module.exports = {
  scoreLinting,
  scoreMarkdown,
  arrayIsNotEmpty,
  scoreGRPCLinting,
  calculateAverageScore,
};
