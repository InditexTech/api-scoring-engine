// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { configValue } = require("../config/config");
const { AppError } = require("../utils/error");
const { httpStatusCodes } = require("../utils/httpStatusCodes");
const {
  API_PROTOCOL,
  VALIDATION_TYPE_DESIGN,
  VALIDATION_TYPE_DOCUMENTATION,
  VALIDATION_TYPE_SECURITY,
  VALIDATION_TYPE_OVERALL_SCORE,
} = require("../verify/types");

const VALIDATION_TYPES = [
  VALIDATION_TYPE_DESIGN,
  VALIDATION_TYPE_DOCUMENTATION,
  VALIDATION_TYPE_SECURITY,
  VALIDATION_TYPE_OVERALL_SCORE,
];
const PROTOCOL_TYPES = Object.values(API_PROTOCOL);

const isValidValidateRequest = ({ url, validationType }) => {
  isValidRepositoryUrl(url);

  if (validationType && !VALIDATION_TYPES.includes(validationType)) {
    throwAppError(
      `Invalid validation type: ${validationType}. Supported values are DESIGN | DOCUMENTATION | SECURITY | OVERALL_SCORE`,
    );
  }
};

const isValidValidateFileRequest = ({ url, apiProtocol }) => {
  if (!url) {
    throwAppError(configValue("cerws.validation.file.url.message"));
  }
  if (typeof url === "string") {
    if (
      !(
        isValidUrl(url) &&
        (url.includes("format=yaml") || url.includes(".yaml") || url.includes(".yml") || url.includes(".proto"))
      )
    ) {
      throwAppError(configValue("cerws.validation.file.url.message"));
    }
  } else if (
    url.mimetype !== "application/json" &&
    url.mimetype !== "text/yaml" &&
    !(url.originalFilename.endsWith(".proto") || url.originalFilename.endsWith(".graphql"))
  ) {
    throwAppError("Not a valid multipart file");
  }

  if (!apiProtocol) {
    throwAppError("File validation requires the 'apiProtocol': possible values are REST | EVENT | GRPC");
  }
  if (!PROTOCOL_TYPES.includes(apiProtocol)) {
    throwAppError("File validation requires the 'apiProtocol' to be a valid protocol: REST | EVENT | GRPC");
  }
};

const isValidRepositoryUrl = (url) => {
  if (!url) {
    throwAppError(configValue("cerws.validation.repository.url.message"));
  }
  if (typeof url === "string") {
    if (!(isValidUrl(url) && (url.includes("format=zip") || url.includes(".zip")))) {
      throwAppError(configValue("cerws.validation.repository.url.message"));
    }
  } else if (url.mimetype !== "application/zip") {
    throwAppError("Not a valid multipart zip file");
  }
};

const isValidUrl = (url) => {
  return stringIsAValidUrl(url, ["http", "https"]);
};

const throwAppError = (message) => {
  throw new AppError({
    code: 400,
    message: message,
    status: httpStatusCodes.HTTP_BAD_REQUEST,
  });
};

const stringIsAValidUrl = (s, protocols) => {
  try {
    const url = new URL(s);
    let isValid;
    if (protocols) {
      if (url.protocol) {
        isValid = protocols.map((x) => `${x.toLowerCase()}:`).includes(url.protocol);
      } else {
        isValid = false;
      }
    } else {
      isValid = true;
    }
    return isValid;
  } catch (err) {
    return false;
  }
};

module.exports = {
  isValidValidateRequest,
  isValidValidateFileRequest,
};
