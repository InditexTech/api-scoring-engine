const constants = require("../utils/constants");
const {
  validateRequiredOption,
  validateApiProtocol,
} = require("../utils/validation-utils");
const { getFileStream, writeOutputJson } = require("../utils/file-utils");

const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const axios = require("axios");
const util = require("util");

const verifyFile = ({ argv }) => {
  try {
    const runOptions = commandLineArgs(
      constants.VERIFY_FILE_RUN_DEFINITIONS_COMMANDS,
      {
        argv,
        stopAtFirstUnknown: true,
      }
    );

    if (runOptions.help) {
      showHelp();
      return;
    }

    validateRequiredOption(
      runOptions,
      constants.VERIFY_SPECIFICATIONFILE_OPTION
    );
    validateRequiredOption(runOptions, constants.VERIFY_API_PROTOCOL_OPTION);

    argv = runOptions._unknown || [];
    const { outputFile, specificationFile, apiProtocol, serviceUrl } =
      runOptions;

    let formData = new Object();

    formData.apiProtocol = validateApiProtocol(apiProtocol);
    formData.url = getFileStream(specificationFile);

    postFileVerify(formData, outputFile, serviceUrl);
  } catch (error) {
    console.error(`${constants.ERROR_VERIFY_FILE_MESSAGE}${error.message}`);
    return;
  }
};

const postFileVerify = (formData, outputFile, serviceUrl) => {
  const usedUrl = serviceUrl
    ? serviceUrl
    : constants.CERTIFICATION_SERVICE_BASE_URL;
  axios
    .post(
      usedUrl + constants.CERTIFICATION_SERVICE_FILE_VERIFY_ENDPOINT,
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
        error
      );
    });
};

let showHelp = () => {
  console.log(commandLineUsage(constants.VERIFY_FILE_HELP_SECTIONS));
};

module.exports = {
  verifyFile,
};
