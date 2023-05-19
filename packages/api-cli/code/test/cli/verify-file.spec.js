const verifyFile = require("../../commands/cli/verify-file");
const constants = require("../../commands/utils/constants");

const axios = require("axios");
const path = require("path");
const commandLineUsage = require("command-line-usage");
const util = require("util");

jest.mock("axios");

describe("verify-file command", () => {
  test("It should show the help for this command", () => {
    console.log = jest.fn();
    const helpText = commandLineUsage(constants.VERIFY_FILE_HELP_SECTIONS);

    expect(verifyFile.verifyFile({ argv: ["--help"] })).toBeFalsy();
    expect(console.log).toHaveBeenCalledWith(helpText);
  });

  test("Test verify-file happy path", async () => {
    const verificationData = {
      hasErrors: false,
      results: [
        {
          code: "error-response-definitions-rfc7807-status",
          message:
            "RFC-7807 Problem specification: status (integer) should be defined",
          path: ["components", "schemas", "errorObject", "properties"],
          severity: 1,
          source:
            "/Temp/89107eb7ff2f22bc54f3e93cad88daf77b54613bcb5d7500/yaml-1673617840813.yaml",
          range: {
            start: {
              line: 695,
              character: 17,
            },
            end: {
              line: 722,
              character: 113,
            },
          },
        },
        {
          code: "error-response-definitions-rfc7807-status",
          message:
            "RFC-7807 Problem specification: status (integer) should be defined",
          path: ["components", "schemas", "400BadRequestError", "properties"],
          severity: 1,
          source:
            "/Temp/89107eb7ff2f22bc54f3e93cad88daf77b54613bcb5d7500/yaml-1673617840813.yaml",
          range: {
            start: {
              line: 734,
              character: 17,
            },
            end: {
              line: 740,
              character: 52,
            },
          },
        },
      ],
    };
    const verificationResponse = { data: verificationData };

    const verificationPromise = Promise.resolve(verificationResponse);

    axios.post.mockImplementation((url) => {
      if (url.includes(constants.CERTIFICATION_SERVICE_FILE_VERIFY_ENDPOINT)) {
        return verificationPromise;
      }
    });

    const specificationFilePath = path
      .join(__dirname, "/../data/openapi-rest.yml")
      .toString();

    expect(
      verifyFile.verifyFile({
        argv: [
          `--specificationFile=${specificationFilePath}`,
          "--apiProtocol=REST",
        ],
      })
    ).toBeFalsy();
    await verificationPromise;
    expect(console.log).toHaveBeenCalledWith(
      util.inspect(verificationData, {
        showHidden: false,
        depth: null,
        colors: true,
      })
    );
  });

  test("Test verify-file when required option 'specificationFile' error", async () => {
    try {
      verifyFile.verifyFile({ argv: ["--apiSpecType=REST"] });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty(
        "message",
        "Failed to verify file: The required option 'specificationFile' must be set."
      );
    }
  });

  test("Test verify-file when required option 'apiProtocol' error", async () => {
    try {
      verifyFile.verifyFile({ argv: ["--specificationFile=openapi-rest.yml"] });
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty(
        "message",
        "Failed to verify file: The required option 'apiProtocol' must be set."
      );
    }
  });
});
