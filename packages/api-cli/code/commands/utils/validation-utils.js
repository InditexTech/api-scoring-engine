// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const constants = require("../utils/constants");

const validateRequiredOption = (runOptions, optionName) => {
  if (!(optionName in runOptions)) {
    throw new Error(
      `${constants.ERROR_REQUIRED_OPTION_PREFIX_MESSAGE}${optionName}${constants.ERROR_REQUIRED_OPTION_SUFFIX_MESSAGE}`,
    );
  }
};

const validateValidationType = (validationType) => {
  if (validationType) {
    const validationTypeUpperCase = validationType.toUpperCase();
    if (constants.VALIDATION_TYPES.includes(validationTypeUpperCase)) {
      return validationTypeUpperCase;
    } else {
      throw new Error(constants.INVALID_VALIDATION_TYPE_MESSAGE);
    }
  } else {
    return constants.VALIDATION_TYPE_OVERALL_SCORE;
  }
};

const validateApiProtocol = (apiProtocol) => {
  const apiProtocolUpperCase = apiProtocol.toUpperCase();
  if (constants.API_PROTOCOLS.includes(apiProtocolUpperCase)) {
    return apiProtocolUpperCase;
  } else {
    throw new Error(constants.INVALID_API_PROTOCOL_MESSAGE);
  }
};

module.exports = {
  validateRequiredOption,
  validateValidationType,
  validateApiProtocol,
};
