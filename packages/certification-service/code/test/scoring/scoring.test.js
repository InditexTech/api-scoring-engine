const { scoreLinting } = require("../../src/scoring/scoring");

describe("Scoring tests", () => {
  describe("filterRepeatedAndSuggestionInfractions", () => {
    test("should return 100 with info infractions", () => {
      const evaluationData = [
        {
          fileName: "openapi-rest.yml",
          code: "contact-email",
          message: "Definition must have a contact email",
          severity: "INFO",
          range: {
            start: {
              line: 3,
              character: 10,
            },
            end: {
              line: 4,
              character: 18,
            },
          },
          path: ["info", "contact"],
          plugin: "spectral",
        },
      ];
      const score = scoreLinting(evaluationData, 1);
      expect(score).toBe(100);
    });

    test("should filter repeated infractions", () => {
      const evaluationData = [
        {
          fileName: "openapi-rest.yml",
          code: "post-http-status-codes-resource",
          message: "Missing the responses[409] http definition",
          severity: "WARN",
          range: {
            start: {
              line: 678,
              character: 16,
            },
            end: {
              line: 720,
              character: 73,
            },
          },
          path: ["paths", "/sample/{id}", "post", "responses"],
          plugin: "spectral",
        },
        {
          fileName: "openapi-rest.yml",
          code: "post-http-status-codes-resource",
          message: "Missing the responses[504] http definition",
          severity: "WARN",
          range: {
            start: {
              line: 678,
              character: 16,
            },
            end: {
              line: 720,
              character: 73,
            },
          },
          path: ["paths", "/sample2/{id}", "post", "responses"],
          plugin: "spectral",
        },
      ];
      const score = scoreLinting(evaluationData, 2);
      expect(score).toBe(50);
    });
  });

  describe("filterErrorRules", () => {
    test("should filter error rules", () => {
      // 1 error = 5 warnings
      const evaluationData = [
        {
          fileName: "openapi-rest.yml",
          code: "post-http-status-codes-resource",
          message: "Missing the responses[409] http definition",
          severity: "ERROR",
          range: {
            start: {
              line: 678,
              character: 16,
            },
            end: {
              line: 720,
              character: 73,
            },
          },
          path: [],
          plugin: "spectral",
        },
      ];
      const score = scoreLinting(evaluationData, 10);
      expect(score).toBe(50);
    });
  });
});
