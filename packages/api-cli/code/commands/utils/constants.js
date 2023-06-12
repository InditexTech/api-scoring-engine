const packageJson = require("../../package.json");

const config = require("config");
const https = require("https");

// command-line-usage sections
const CLI_HELP_SECTIONS = [
  {
    header: "apicli",
    content: "CLI tool for the API-First Strategy - v" + packageJson.version,
  },
  {
    header: "Command List",
    content: [
      { name: "help", summary: "Display help information." },
      { name: "version", summary: "Show version." },
      { name: "verify", summary: "Verify your API set." },
      {
        name: "verify-file",
        summary: "Verify REST API specification file content.",
      },
    ],
  },
];
const VERIFY_HELP_SECTIONS = [
  {
    header: "apicli",
    content: "CLI tool for the API-First Strategy - v" + packageJson.version,
  },
  {
    header: "'verify' command help",
    optionList: [
      {
        name: "help",
        alias: "h",
        type: Boolean,
        description: "Display help information.",
      },
      {
        name: "serviceUrl",
        alias: "u",
        type: String,
        description:
          "By default, the URL configured in the 'app.certification-service-base-url' property is used. Use it if you wish to override.",
      },
      {
        name: "validationType",
        alias: "t",
        type: String,
        description: "(DESIGN|DOCUMENTATION|SECURITY|OVERALL_SCORE). Default value is OVERALL_SCORE.",
      },
      {
        name: "outputFile",
        alias: "o",
        type: String,
        description: "Store the output on a TXT file",
      },
      {
        name: "workingDir",
        alias: "w",
        type: String,
        description:
          "By default, the current directory is used as the base. Through this option, an alternative directory can be specified. Should be the root directory.",
      },
      {
        name: "no-verbose",
        alias: "b",
        type: Boolean,
        description:
          "Output summary result of the validation. Full result is only available when validationType REPOSITORY.",
      },
    ],
  },
];
const VERIFY_FILE_HELP_SECTIONS = [
  {
    header: "apicli",
    content: "CLI tool for the API-First Strategy - v" + packageJson.version,
  },
  {
    header: "'verify-file' command help",
    optionList: [
      {
        name: "help",
        alias: "h",
        type: Boolean,
        description: "Display help information.",
      },
      {
        name: "serviceUrl",
        alias: "u",
        type: String,
        description:
          "By default, the URL configured in the 'app.certification-service-base-url' property is used. Use it if you wish to override.",
      },
      {
        name: "outputFile",
        alias: "o",
        type: String,
        description: "Store the output on a TXT file",
      },
      {
        name: "specificationFile",
        alias: "f",
        type: String,
        description: "REQUIRED API Specification file for which the content will be verified.",
      },
      {
        name: "apiProtocol",
        alias: "t",
        type: String,
        description: "REQUIRED API Specification file protocol (REST|EVENT|GRPC).",
      },
    ],
  },
];

// Figlet
const FIGLET_HORIZONTAL_LAYOUT_FULL = "full";

// Commands
const NAME_COMMAND = "name";
const HELP_COMMAND = "help";
const VERSION_COMMAND = "version";
const VERIFY_COMMAND = "verify";
const VERIFY_FILE_COMMAND = "verify-file";
const MAIN_RUN_DEFINITIONS_COMMANDS = [{ name: "help", alias: "h", type: Boolean, defaultValue: false }];
const VERIFY_NO_VERBOSE_OPTION = "no-verbose";
const VERIFY_RUN_DEFINITIONS_COMMANDS = [
  { name: "help", alias: "h", type: Boolean, defaultValue: false },
  { name: "serviceUrl", alias: "u", type: String },
  { name: "validationType", alias: "t", type: String, defaultValue: false },
  { name: "outputFile", alias: "o", type: String },
  { name: "workingDir", alias: "w", type: String, defaultValue: "." },
  {
    name: VERIFY_NO_VERBOSE_OPTION,
    alias: "b",
    type: Boolean,
    defaultValue: false,
  },
];
const VERIFY_SPECIFICATIONFILE_OPTION = "specificationFile";
const VERIFY_API_PROTOCOL_OPTION = "apiProtocol";
const VERIFY_FILE_RUN_DEFINITIONS_COMMANDS = [
  { name: "help", alias: "h", type: Boolean, defaultValue: false },
  { name: "serviceUrl", alias: "u", type: String },
  { name: "outputFile", alias: "o", type: String },
  { name: VERIFY_SPECIFICATIONFILE_OPTION, alias: "f", type: String },
  { name: VERIFY_API_PROTOCOL_OPTION, alias: "t", type: String },
];

// Messages
const VERSION_MESSAGE = `Version: ${packageJson.version}`;
const APICLI_MESSAGE = "apicli";
const APICLI_VERSION_MESSAGE = `${APICLI_MESSAGE} v${packageJson.version}`;
const UNRECOGNIZED_OPTION_PREFIX_MESSAGE = "Unrecognized option ";
const UNRECOGNIZED_OPTION_SUFFIX_MESSAGE = ", see usage below:";
const INVALID_NUMBER_ARGUMENTS_MESSAGE = "Invalid number of arguments.";
const INVALID_VALIDATION_TYPE_MESSAGE = "\nInvalid validation type. Try design|security|documentation|overall_score\n";
const INVALID_API_PROTOCOL_MESSAGE = "\nInvalid API specification protocol. Try rest|event\n";
const ERROR_REMOVING_REPO_ZIP_MESSAGE = "Error removing 'repo.zip' file";
const ERROR_WRITING_JSON_TO_FILE_MESSAGE = "An error occured while writing JSON Object to File.";
const ERROR_REQUEST_CERTIFICATION_MESSAGE = "Failed to request certification: ";
const ERROR_VERIFY_MESSAGE = "Failed to verify: ";
const ERROR_VERIFY_FILE_MESSAGE = "Failed to verify file: ";
const ERROR_REQUIRED_OPTION_PREFIX_MESSAGE = "The required option '";
const ERROR_REQUIRED_OPTION_SUFFIX_MESSAGE = "' must be set.";
const ERROR_FILE_ACCESS_PREFIX_MESSAGE = "Failed to access '";
const ERROR_FILE_ACCESS_SUFFIX_MESSAGE = "' file'";

// Verify
const UNWANTED_DIRECTORIES = [".github", "node_modules", ".git", ".DS_Store", "docs"];
const VALIDATION_TYPE_DESIGN = "DESIGN";
const VALIDATION_TYPE_DOCUMENTATION = "DOCUMENTATION";
const VALIDATION_TYPE_SECURITY = "SECURITY";
const VALIDATION_TYPE_OVERALL_SCORE = "OVERALL_SCORE";
const VALIDATION_TYPES = [
  VALIDATION_TYPE_DESIGN,
  VALIDATION_TYPE_DOCUMENTATION,
  VALIDATION_TYPE_SECURITY,
  VALIDATION_TYPE_OVERALL_SCORE,
];
const VALIDATION_ZIP_FILE_EXTENSION = ".zip";
const VALIDATION_ZIP_FILE_NAME = `repo${VALIDATION_ZIP_FILE_EXTENSION}`;
const VALIDATION_ZIP_PATH = `./${VALIDATION_ZIP_FILE_NAME}`;
const OUTPUT_FILE_PATH = ".";
const API_PROTOCOL_REST = "REST";
const API_PROTOCOL_EVENT = "EVENT";
const API_PROTOCOL_GRPC = "GRPC";
const API_PROTOCOLS = [API_PROTOCOL_REST, API_PROTOCOL_EVENT, API_PROTOCOL_GRPC];

// Common
const CERTIFICATION_SERVICE_BASE_URL = config.get("app.certification-service-base-url");
const CERTIFICATION_SERVICE_VALIDATIONS_ENDPOINT = "v1/apis/validate";
const CERTIFICATION_SERVICE_FILE_VERIFY_ENDPOINT = "v1/apis/verify";
const HTTPS_AGENT = new https.Agent({
  rejectUnauthorized: false,
});
const CONTENT_TYPE_MULTIPART_FORM_DATA_HEADER = {
  "Content-Type": "multipart/form-data",
};
const UTF8_ENCODING = "utf8";
const TRUE_AS_STRING = "true";
const FALSE_AS_STRING = "false";

module.exports = {
  VERIFY_HELP_SECTIONS,
  VERIFY_FILE_HELP_SECTIONS,
  CLI_HELP_SECTIONS,
  FIGLET_HORIZONTAL_LAYOUT_FULL,
  NAME_COMMAND,
  HELP_COMMAND,
  VERSION_COMMAND,
  VERIFY_COMMAND,
  VERIFY_FILE_COMMAND,
  MAIN_RUN_DEFINITIONS_COMMANDS,
  VERIFY_NO_VERBOSE_OPTION,
  VERIFY_RUN_DEFINITIONS_COMMANDS,
  VERIFY_SPECIFICATIONFILE_OPTION,
  VERIFY_API_PROTOCOL_OPTION,
  VERIFY_FILE_RUN_DEFINITIONS_COMMANDS,
  VERSION_MESSAGE,
  APICLI_MESSAGE,
  APICLI_VERSION_MESSAGE,
  UNRECOGNIZED_OPTION_PREFIX_MESSAGE,
  UNRECOGNIZED_OPTION_SUFFIX_MESSAGE,
  INVALID_NUMBER_ARGUMENTS_MESSAGE,
  INVALID_VALIDATION_TYPE_MESSAGE,
  INVALID_API_PROTOCOL_MESSAGE,
  ERROR_REMOVING_REPO_ZIP_MESSAGE,
  ERROR_WRITING_JSON_TO_FILE_MESSAGE,
  ERROR_REQUEST_CERTIFICATION_MESSAGE,
  ERROR_VERIFY_MESSAGE,
  ERROR_VERIFY_FILE_MESSAGE,
  ERROR_REQUIRED_OPTION_PREFIX_MESSAGE,
  ERROR_REQUIRED_OPTION_SUFFIX_MESSAGE,
  ERROR_FILE_ACCESS_PREFIX_MESSAGE,
  ERROR_FILE_ACCESS_SUFFIX_MESSAGE,
  UNWANTED_DIRECTORIES,
  VALIDATION_TYPE_DESIGN,
  VALIDATION_TYPE_DOCUMENTATION,
  VALIDATION_TYPE_SECURITY,
  VALIDATION_TYPE_OVERALL_SCORE,
  VALIDATION_TYPES,
  VALIDATION_ZIP_FILE_EXTENSION,
  VALIDATION_ZIP_FILE_NAME,
  VALIDATION_ZIP_PATH,
  OUTPUT_FILE_PATH,
  API_PROTOCOL_REST,
  API_PROTOCOL_EVENT,
  API_PROTOCOL_GRPC,
  API_PROTOCOLS,
  CERTIFICATION_SERVICE_BASE_URL,
  CERTIFICATION_SERVICE_VALIDATIONS_ENDPOINT,
  CERTIFICATION_SERVICE_FILE_VERIFY_ENDPOINT,
  HTTPS_AGENT,
  CONTENT_TYPE_MULTIPART_FORM_DATA_HEADER,
  UTF8_ENCODING,
  TRUE_AS_STRING,
  FALSE_AS_STRING,
};
