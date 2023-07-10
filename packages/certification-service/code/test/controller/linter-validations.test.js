// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { isValidValidateRequest, isValidValidateFileRequest } = require("../../src/controllers/linter-validations");
const { AppError } = require("../../src/utils/error");

describe("Linter Validations", () => {
  describe("isValidValidateRequest unit tests", () => {
    test("linter validations when body has no validationType should be valid", () => {
      expect.assertions(0);
      try {
        isValidValidateRequest({ url: "https://github.com/app-test/archive/refs/heads/main.zip" });
      } catch (error) {}
    });

    test("linter validations when body has unsuported validationType", () => {
      expect.assertions(2);

      try {
        isValidValidateRequest({
          validationType: "UNKMOWN",
          url: "https://github.com/app-test/archive/refs/heads/main.zip",
        });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty(
          "message",
          "Invalid validation type: UNKMOWN. Supported values are DESIGN | DOCUMENTATION | SECURITY | OVERALL_SCORE",
        );
      }
    });

    test("validate is NOT Valid ZIP File", () => {
      const ctx = {
        request: {
          body: {
            url: "https://github.com/app-test/archive/refs/heads/main",
          },
        },
      };
      expect.assertions(2);

      try {
        isValidValidateRequest({ url: ctx.request.body.url });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty(
          "message",
          "validation OVERALL_SCORE requires 'url' body field to be a valid Url, to be from github and to be a zip file.",
        );
      }
    });

    test("validate is NOT Valid Url", () => {
      const ctx = {
        request: {
          body: {
            url: "www.google.com",
          },
        },
      };
      expect.assertions(2);

      try {
        isValidValidateRequest({ url: ctx.request.body.url });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty(
          "message",
          "validation OVERALL_SCORE requires 'url' body field to be a valid Url, to be from github and to be a zip file.",
        );
      }
    });

    test("validate with a unsupported url protocol", () => {
      const ctx = {
        request: {
          body: {
            validationType: "OVERALL_SCORE",
            url: "ftp://github.com/app-test/archive/refs/heads/main.zip",
          },
        },
      };
      expect.assertions(2);

      try {
        isValidValidateRequest({
          url: ctx.request.body.url,
          validationType: ctx.request.body.validationType,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty(
          "message",
          "validation OVERALL_SCORE requires 'url' body field to be a valid Url, to be from github and to be a zip file.",
        );
      }
    });

    test("validate with a malformed url", () => {
      const ctx = {
        request: {
          body: {
            validationType: "OVERALL_SCORE",
            url: "malformed",
          },
        },
      };
      expect.assertions(2);

      try {
        isValidValidateRequest({
          url: ctx.request.body.url,
          validationType: ctx.request.body.validationType,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty(
          "message",
          "validation OVERALL_SCORE requires 'url' body field to be a valid Url, to be from github and to be a zip file.",
        );
      }
    });

    test("validate happy path", () => {
      const ctx = {
        request: {
          body: { validationType: "OVERALL_SCORE", url: "https://github.com/app-test/archive/refs/heads/main.zip" },
        },
      };
      expect.assertions(0);

      try {
        isValidValidateRequest({ url: ctx.request.body.url });
      } catch (error) {}
    });
  });

  describe("isValidValidateFileRequest unit tests", () => {
    test("validate file is NOT Valid url", () => {
      const ctx = {
        request: {
          body: {
            url: "www.google.com",
            apiProtocol: "REST",
          },
        },
      };
      expect.assertions(2);

      try {
        isValidValidateFileRequest({ url: ctx.request.body.url });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty(
          "message",
          "File validation requires the 'url' to be a valid Url, to be from github and must be a yaml/yml file",
        );
      }
    });

    test("linter file validations when body has no url", () => {
      const ctx = { request: { body: { apiProtocol: "REST" } } };
      expect.assertions(2);

      try {
        isValidValidateFileRequest({ url: ctx.request.body.url });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty(
          "message",
          "File validation requires the 'url' to be a valid Url, to be from github and must be a yaml/yml file",
        );
      }
    });

    test("validate file with a unsupported url protocol", () => {
      const ctx = {
        request: {
          body: {
            url: "ftp://raw.githubusercontent.com/app-test/develop/apis/rest/openapi-rest.yml",
            apiProtocol: "REST",
          },
        },
      };
      expect.assertions(2);

      try {
        isValidValidateFileRequest({
          url: ctx.request.body.url,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty(
          "message",
          "File validation requires the 'url' to be a valid Url, to be from github and must be a yaml/yml file",
        );
      }
    });

    test("validate file with a malformed url", () => {
      const ctx = {
        request: {
          body: {
            url: "malformed",
            apiProtocol: "REST",
          },
        },
      };
      expect.assertions(2);

      try {
        isValidValidateFileRequest({
          url: ctx.request.body.url,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty(
          "message",
          "File validation requires the 'url' to be a valid Url, to be from github and must be a yaml/yml file",
        );
      }
    });

    test("validate file is NOT Valid yaml File", () => {
      const ctx = {
        request: {
          body: {
            url: "https:raw.githubusercontent.com/app-test/develop/README.md",
            apiProtocol: "REST",
          },
        },
      };
      expect.assertions(2);

      try {
        isValidValidateFileRequest({ url: ctx.request.body.url });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty(
          "message",
          "File validation requires the 'url' to be a valid Url, to be from github and must be a yaml/yml file",
        );
      }
    });

    test("validate file without apiProtocol should throw error", () => {
      expect.assertions(2);
      try {
        isValidValidateFileRequest({
          url: "https://raw.githubusercontent.com/app-test/develop/apis/rest/openapi-rest.yml",
        });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty(
          "message",
          "File validation requires the 'apiProtocol': possible values are REST | EVENT | GRPC",
        );
      }
    });

    test("validate file with unsuported apiProtocol should throw error", () => {
      expect.assertions(2);
      try {
        isValidValidateFileRequest({
          url: "https://raw.githubusercontent.com/app-test/develop/apis/rest/openapi-rest.yml",
          apiProtocol: "GRAPHQL",
        });
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect(error).toHaveProperty(
          "message",
          "File validation requires the 'apiProtocol' to be a valid protocol: REST | EVENT | GRPC",
        );
      }
    });

    test("validate file with valid params should be ok", () => {
      isValidValidateFileRequest({
        url: "https://raw.githubusercontent.com/app-test/develop/apis/rest/openapi-rest.yml",
        apiProtocol: "REST",
      });
      expect(true).toBeDefined();
    });
  });
});
