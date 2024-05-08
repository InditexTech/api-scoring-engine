// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { evaluate } = require("../../src/evaluate/spectralEvaluate");
const { LintRuleset } = require("../../src/evaluate/lint/lintRuleset");
const nock = require("nock");
const path = require("path");
const config = require("../../src/config/config");
const yaml = require("js-yaml");

const emptyOpenAPIFilePath = fixFilename4Windows(path.join(__dirname, "../data/openapi-rest.yml"));
const faultyOpenAPIFilePath = fixFilename4Windows(path.join(__dirname, "../data/openapi-rest2.yml"));

function fixFilename4Windows(filename) {
  filename = filename.replace(/\\/g, "/");
  return filename.charAt(0).toLowerCase() + filename.slice(1);
}

jest.mock("../../src/config/config", () => {
  const originalModule = jest.requireActual("../../src/config/config");
  return {
    __esModule: true,
    ...originalModule,
    configValue: jest.fn().mockImplementation((property, defaultValue) => {
      return originalModule.configValue(property, defaultValue);
    }),
  };
});

const expectedRESTResult = {
  code: "info-contact",
  message: 'Info object must have "contact" object.',
  path: [],
  severity: 1,
  source: emptyOpenAPIFilePath,
  range: { start: { character: 0, line: 4 }, end: { character: 14, line: 4 } },
};

const expectedRESTSecurityResult = {
  code: "global-security",
  message: "Global 'security' field is not defined",
  path: [],
  severity: 0,
  source: faultyOpenAPIFilePath,
  range: { start: { character: 0, line: 4 }, end: { character: 40, line: 26 } },
};

const resultsForCode = (results, code) => {
  return results.filter((r) => r.code === code);
};

describe("Tests Spectral Evaluation", () => {
  test("spectral REST evaluation on almost empty yaml must return results including info-contact result code", async () => {
    const evaluationResult = await evaluate(LintRuleset.REST_GENERAL.rulesetPath, emptyOpenAPIFilePath);

    const result = resultsForCode(evaluationResult, "info-contact");

    const testObject = evaluationResult[0];

    expect(evaluationResult.length).toBeGreaterThanOrEqual(1);
    expect(result).toBeDefined();
    expect(testObject).toStrictEqual(expectedRESTResult);
  });

  test("spectral EVENT evaluation with http ref for our bitbucket should have invalid-ref due to certificate issues", async () => {
    const filePath = path.join(__dirname, "../data/asyncapi.yml");
    const evaluationResult = await evaluate(LintRuleset.EVENT_GENERAL.rulesetPath, filePath);

    const result = resultsForCode(evaluationResult, "invalid-ref");

    expect(evaluationResult.length).toBeGreaterThanOrEqual(1);
    expect(result).toBeDefined();
  });

  test("spectral REST evaluation with custom rules - Endpoint with no 400 response code defined, should have post-http-status-codes-collections", async () => {
    const evaluationResult = await evaluate(LintRuleset.REST_GENERAL.rulesetPath, faultyOpenAPIFilePath);

    const result = resultsForCode(evaluationResult, "post-http-status-codes-collections");

    expect(evaluationResult.length).toBeGreaterThanOrEqual(1);
    expect(result).toBeDefined();
  });

  test("spectral REST Security evaluation with custom rules - no security defined, so should have error saying so", async () => {
    const evaluationResult = await evaluate(LintRuleset.REST_SECURITY.rulesetPath, faultyOpenAPIFilePath);

    const testObject = evaluationResult[0];

    expect(evaluationResult.length).toBeGreaterThanOrEqual(1);
    expect(testObject).toStrictEqual(expectedRESTSecurityResult);
  });

  describe("Test secured external refs", () => {
    test("Should resolve secured external refs", async () => {
      const authHeader = "Bearer a_token";
      jest.spyOn(config, "configValue").mockReturnValue(authHeader);
      nock("https://shared-schemas", {
        reqheaders: { Authorization: authHeader },
      })
        .get("/apis/common/sample/rest/sample.yml")
        .reply(
          200,
          yaml.dump({
            Sample: {
              title: "Sample",
              description: "Sample entity",
              additionalProperties: false,
              properties: {
                code: {
                  type: "string",
                },
                name: {
                  type: "string",
                },
              },
              required: ["code", "name"],
            },
          }),
        );

      const issues = await evaluate(
        LintRuleset.REST_GENERAL.rulesetPath,
        fixFilename4Windows(path.join(__dirname, "../data/openapi-rest-external-refs.yml")),
      );

      expect(issues).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "ensure-properties-examples",
            message: "code doesn't have an example",
            path: ["Sample", "properties", "code"],
            severity: expect.any(Number),
            source: "https://shared-schemas/apis/common/sample/rest/sample.yml",
            range: expect.objectContaining({
              start: expect.objectContaining({ line: expect.any(Number), character: expect.any(Number) }),
              end: expect.objectContaining({ line: expect.any(Number), character: expect.any(Number) }),
            }),
          }),
          expect.objectContaining({
            code: "ensure-properties-examples",
            message: "name doesn't have an example",
            path: ["Sample", "properties", "name"],
            severity: expect.any(Number),
            source: "https://shared-schemas/apis/common/sample/rest/sample.yml",
            range: expect.objectContaining({
              start: expect.objectContaining({ line: expect.any(Number), character: expect.any(Number) }),
              end: expect.objectContaining({ line: expect.any(Number), character: expect.any(Number) }),
            }),
          }),
        ]),
      );
    });

    test("Should not resolve secured external refs", async () => {
      jest.spyOn(config, "configValue").mockReturnValue(undefined);
      nock("https://shared-schemas").get("/apis/common/sample/rest/sample.yml").reply(401);

      const issues = await evaluate(
        LintRuleset.REST_GENERAL.rulesetPath,
        fixFilename4Windows(path.join(__dirname, "../data/openapi-rest-external-refs.yml")),
      );

      expect(issues).toStrictEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "invalid-ref",
            path: ["components", "schemas", "Sample", "$ref"],
            message: "ReadError: 401 Unauthorized",
            severity: expect.any(Number),
            source: expect.any(String),
            range: expect.objectContaining({
              start: expect.objectContaining({ line: expect.any(Number), character: expect.any(Number) }),
              end: expect.objectContaining({ line: expect.any(Number), character: expect.any(Number) }),
            }),
          }),
        ]),
      );
    });
  });
});
