const verify = require("../../commands/cli/verify");
const constants = require("../../commands/utils/constants");

const axios = require("axios");
const commandLineUsage = require("command-line-usage");
const util = require("util");

jest.mock("axios");

describe("verify command", () => {
  test("It should show the help for this command", () => {
    console.log = jest.fn();
    const helpText = commandLineUsage(constants.VERIFY_HELP_SECTIONS);

    expect(verify.verify({ argv: ["--help"] })).toBeFalsy();
    expect(console.log).toHaveBeenCalledWith(helpText);
  });

  test("Test verify happy path", async () => {
    const certificationData = [
      {
        apiVersion: "1.0.0",
        apiName: "API Name",
        apiProtocol: 1,
        validationDateTime: "2022-12-29T11:38:29.731Z",
        result: [
          {
            designValidation: {
              validationType: "DESIGN",
              score: 98.7,
              rating: "A",
              ratingDescription: "Very Good",
            },
          },
          {
            securityValidation: {
              validationType: 2,
              score: 95.24,
              rating: "A",
              ratingDescription: "Very Good",
            },
          },
          {
            documentationValidation: {
              validationType: 3,
              score: 68.89,
              rating: "C",
              ratingDescription: "Adequate",
            },
          },
        ],
        score: 92.67,
        rating: "A",
        ratingDescription: "Very Good",
        hasErrors: false,
      },
    ];
    const certificationResponse = { data: certificationData };

    const certificationPromise = Promise.resolve(certificationResponse);

    axios.post.mockImplementation((url) => {
      if (url.includes(constants.CERTIFICATION_SERVICE_VALIDATIONS_ENDPOINT)) {
        return certificationPromise;
      }
    });

    expect(
      verify.verify({ argv: ["--validationType=overall_score"] })
    ).toBeFalsy();
    await certificationPromise;
    expect(console.log).toHaveBeenCalledWith(
      util.inspect(certificationData, {
        showHidden: false,
        depth: null,
        colors: true,
      })
    );
  });
});
