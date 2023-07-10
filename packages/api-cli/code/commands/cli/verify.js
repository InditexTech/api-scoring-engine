// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const constants = require("../utils/constants");
const { validateValidationType } = require("../utils/validation-utils");
const { createZipWithValueDirectories } = require("../utils/zip-utils");
const { writeOutputJson } = require("../utils/file-utils");

const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const axios = require("axios");
const util = require("util");

const verify = ({ argv }) => {
  try {
    const runOptions = commandLineArgs(
      constants.VERIFY_RUN_DEFINITIONS_COMMANDS,
      {
        argv,
        stopAtFirstUnknown: true,
      }
    );

    if (runOptions.help) {
      showHelp();
      return;
    }

    argv = runOptions._unknown || [];
    const { validationType, outputFile, workingDir, serviceUrl } = runOptions;
    const noVerbose = runOptions[constants.VERIFY_NO_VERBOSE_OPTION];

    let formData = new Object();

    formData.validationType = validateValidationType(validationType);

    formData.file = createZipWithValueDirectories(workingDir);

    formData.isVerbose = noVerbose
      ? constants.FALSE_AS_STRING
      : constants.TRUE_AS_STRING;

    postValidations(formData, outputFile, serviceUrl);
  } catch (error) {
    console.error(`${constants.ERROR_VERIFY_MESSAGE}${error.message}`);
    return;
  }
};

const postValidations = (formData, outputFile, serviceUrl) => {
  const usedUrl = serviceUrl
    ? serviceUrl
    : constants.CERTIFICATION_SERVICE_BASE_URL;
  axios
    .post(
      usedUrl + constants.CERTIFICATION_SERVICE_VALIDATIONS_ENDPOINT,
      formData,
      {
        headers: constants.CONTENT_TYPE_MULTIPART_FORM_DATA_HEADER,
        httpsAgent: constants.HTTPS_AGENT,
      }
    )
    .then((response) => {
      console.log(
        util.inspect(response.data, {
          showHidden: false,
          depth: null,
          colors: true,
        })
      );
      if (outputFile) {
        writeOutputJson(constants.OUTPUT_FILE_PATH, outputFile, response.data);
      }
    })
    .catch((error) => {
      return console.error(
        constants.ERROR_REQUEST_CERTIFICATION_MESSAGE,
        error.response.data.error
      );
    });
};

let showHelp = () => {
  console.log(commandLineUsage(constants.VERIFY_HELP_SECTIONS));
};

module.exports = {
  verify,
};
