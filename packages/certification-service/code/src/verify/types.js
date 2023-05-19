const { configValue } = require("../config/config");

const VALIDATION_TYPE_DESIGN = 1;
const VALIDATION_TYPE_DOCUMENTATION = 2;
const VALIDATION_TYPE_SECURITY = 3;
const VALIDATION_TYPE_OVERALL_SCORE = 4;

const API_PROTOCOL = {
  REST: 1,
  EVENT: 2,
  GRPC: 3,
};

const INVALID_REF_CUSTOMIZED = "References to schemas outside of the API directory are not allowed";

const SCORES_WEIGHTS_BY_VALIDATION_TYPE = {
  1: configValue("cerws.certification.scoring.modules-weights.design"),
  2: configValue("cerws.certification.scoring.modules-weights.documentation"),
  3: configValue("cerws.certification.scoring.modules-weights.security"),
};

const SCORES_WEIGHTS_BY_VALIDATION_TYPE_WITHOUT_SECURITY = {
  1: configValue("cerws.certification.scoring.modules-weights-without-security.design"),
  2: configValue("cerws.certification.scoring.modules-weights-without-security.documentation"),
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
};
