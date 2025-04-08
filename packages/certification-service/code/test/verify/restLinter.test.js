// SPDX-FileCopyrightText: 2024 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { VALIDATION_TYPE_DESIGN, VALIDATION_TYPE_SECURITY, API_PROTOCOL } = require("../../src/verify/types");
const { RestLinter } = require("../../src/verify/restLinter");
const linter = require("../../src/verify/lint");

jest.mock("../../src/verify/lint");

describe("Rest linter tests", () => {
  test("Should add external url to issue filename", async () => {
    const designIssues = [
      {
        code: "paths-param-examples",
        message: '"sampleCode.example" must be defined',
        path: ["components", "parameters", "pathSampleCode"],
        severity: 1,
        source: "/temp/my-api/rest/openapi-rest.yml",
        range: {
          start: {
            line: 201,
            character: 19,
          },
          end: {
            line: 209,
            character: 26,
          },
        },
      },
      {
        code: "ensure-properties-examples",
        message: "code doesn't have an example",
        path: ["Sample", "properties", "code"],
        severity: 1,
        source: "https://shared-schemas/apis/common/sample/rest/sample.yml",
        range: {
          start: {
            line: 5,
            character: 9,
          },
          end: {
            line: 6,
            character: 18,
          },
        },
      },
    ];
    const securityIssues = [
      {
        code: "global-security",
        message: "Global 'security' field is not defined",
        path: [],
        severity: 0,
        source: "/temp/my-api/rest/openapi-rest.yml",
        range: {
          start: {
            line: 4,
            character: 0,
          },
          end: {
            line: 209,
            character: 26,
          },
        },
      },
      {
        code: "string-properties-required-max-length",
        message: '"code.maxLength" property must be truthy',
        path: ["Sample", "properties", "code"],
        severity: 1,
        source: "https://shared-schemas/apis/common/sample/rest/sample.yml",
        range: {
          start: {
            line: 5,
            character: 9,
          },
          end: {
            line: 6,
            character: 18,
          },
        },
      },
    ];
    jest
      .spyOn(linter, "lintFileWithSpectral")
      .mockResolvedValueOnce(designIssues)
      .mockResolvedValueOnce(securityIssues);
    const apiValidation = {
      validationDateTime: new Date().toISOString(),
      apiName: "My API",
      apiVersion: "1.0.0",
      apiProtocol: API_PROTOCOL.REST,
      result: [],
      score: 0,
      rating: "D",
      ratingDescription: "",
      hasErrors: false,
    };

    const design = {
      designValidation: {
        validationType: VALIDATION_TYPE_DESIGN,
        spectralValidation: { issues: [] },
        protolintValidation: { issues: [] },
      },
    };
    const security = {
      securityValidation: {
        validationType: VALIDATION_TYPE_SECURITY,
        spectralValidation: { issues: [] },
        protolintValidation: { issues: [] },
      },
    };

    await RestLinter.lintRest({
      validationType: null,
      file: "/temp/my-api/rest/openapi-rest.yml",
      fileName: "my-api/rest/openapi-rest.yml",
      rootFolder: "/root/folder",
      apiValidation,
      design,
      security,
      tempDir: "/temp",
    });

    expect(design.designValidation.spectralValidation.issues).toHaveLength(designIssues.length);
    expect(security.securityValidation.spectralValidation.issues).toHaveLength(securityIssues.length);
    expect(design.designValidation.spectralValidation.issues).toStrictEqual(
      expect.arrayContaining([
        {
          code: "paths-param-examples",
          message: '"sampleCode.example" must be defined',
          path: ["components", "parameters", "pathSampleCode"],
          severity: 1,
          source: "my-api/rest/openapi-rest.yml",
          range: {
            start: {
              line: 201,
              character: 19,
            },
            end: {
              line: 209,
              character: 26,
            },
          },
          fileName: "my-api/rest/openapi-rest.yml",
        },
        {
          code: "ensure-properties-examples",
          message: "code doesn't have an example",
          path: ["Sample", "properties", "code"],
          severity: 1,
          source: "https://shared-schemas/apis/common/sample/rest/sample.yml",
          range: {
            start: {
              line: 5,
              character: 9,
            },
            end: {
              line: 6,
              character: 18,
            },
          },
          fileName: "https://shared-schemas/apis/common/sample/rest/sample.yml",
        },
      ]),
    );
    expect(security.securityValidation.spectralValidation.issues).toStrictEqual(
      expect.arrayContaining([
        {
          code: "global-security",
          message: "Global 'security' field is not defined",
          path: [],
          severity: 0,
          source: "my-api/rest/openapi-rest.yml",
          range: {
            start: {
              line: 4,
              character: 0,
            },
            end: {
              line: 209,
              character: 26,
            },
          },
          fileName: "my-api/rest/openapi-rest.yml",
        },
        {
          code: "string-properties-required-max-length",
          message: '"code.maxLength" property must be truthy',
          path: ["Sample", "properties", "code"],
          severity: 1,
          source: "https://shared-schemas/apis/common/sample/rest/sample.yml",
          range: {
            start: {
              line: 5,
              character: 9,
            },
            end: {
              line: 6,
              character: 18,
            },
          },
          fileName: "https://shared-schemas/apis/common/sample/rest/sample.yml",
        },
      ]),
    );
  });
});
