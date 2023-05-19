const constants = require("../utils/constants");

const validateRequiredOption = (runOptions, optionName) => {
  if (!(optionName in runOptions)) {
    throw new Error(
      `${constants.ERROR_REQUIRED_OPTION_PREFIX_MESSAGE}${optionName}${constants.ERROR_REQUIRED_OPTION_SUFFIX_MESSAGE}`
    );
  }
};

const validateValidationType = (validationType) => {
  if (validationType) {
    const validationTypeUpperCase = validationType.toUpperCase();
    if (constants.VALIDATION_TYPES.includes(validationTypeUpperCase)) {
      return constants.VALIDATION_TYPES.indexOf(validationTypeUpperCase) + 1;
    } else {
      throw new Error(constants.INVALID_VALIDATION_TYPE_MESSAGE);
    }
  } else {
    // returns integer associated with OVERALL_SCORE
    return 4;
  }
};

const validateApiProtocol = (apiProtocol) => {
  const apiProtocolUpperCase = apiProtocol.toUpperCase();
  if (constants.API_PROTOCOLS.includes(apiProtocolUpperCase)) {
    return constants.API_PROTOCOLS.indexOf(apiProtocolUpperCase) + 1;
  } else {
    throw new Error(constants.INVALID_API_PROTOCOL_MESSAGE);
  }
};

module.exports = {
  validateRequiredOption,
  validateValidationType,
  validateApiProtocol,
};
