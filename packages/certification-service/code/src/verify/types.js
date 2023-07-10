// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { configValue } = require("../config/config");

const VALIDATION_TYPE_DESIGN = "DESIGN";
const VALIDATION_TYPE_DOCUMENTATION = "DOCUMENTATION";
const VALIDATION_TYPE_SECURITY = "SECURITY";
const VALIDATION_TYPE_OVERALL_SCORE = "OVERALL_SCORE";

const NUMBER_OF_GRPC_RULES = configValue("cerws.lint.grpc.number-of-base-rules");

const API_PROTOCOL = {
  REST: "REST",
  EVENT: "EVENT",
  GRPC: "GRPC",
};

const INVALID_REF_CUSTOMIZED = "References to schemas outside of the API directory are not allowed";

const SCORES_WEIGHTS_BY_VALIDATION_TYPE = {
  DESIGN: configValue("cerws.certification.scoring.modules-weights.design"),
  DOCUMENTATION: configValue("cerws.certification.scoring.modules-weights.documentation"),
  SECURITY: configValue("cerws.certification.scoring.modules-weights.security"),
};

const SCORES_WEIGHTS_BY_VALIDATION_TYPE_WITHOUT_SECURITY = {
  DESIGN: configValue("cerws.certification.scoring.modules-weights-without-security.design"),
  DOCUMENTATION: configValue("cerws.certification.scoring.modules-weights-without-security.documentation"),
};

module.exports = {
  VALIDATION_TYPE_DESIGN,
  VALIDATION_TYPE_DOCUMENTATION,
  VALIDATION_TYPE_SECURITY,
  VALIDATION_TYPE_OVERALL_SCORE,
  INVALID_REF_CUSTOMIZED,
  SCORES_WEIGHTS_BY_VALIDATION_TYPE,
  SCORES_WEIGHTS_BY_VALIDATION_TYPE_WITHOUT_SECURITY,
  API_PROTOCOL,
  NUMBER_OF_GRPC_RULES,
};
