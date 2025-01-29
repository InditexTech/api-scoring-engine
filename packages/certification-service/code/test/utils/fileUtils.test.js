// SPDX-FileCopyrightText: 2025 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { isGraphqlFileExtension } = require("../../src/utils/fileUtils");

describe("FileUtils tests", () => {
  describe("isGraphqlFileExtension", () => {
    test.each([["graphql"], ["graphqls"], ["gql"]])("should return true for '%s' extension", (extension) => {
      expect(isGraphqlFileExtension(`schema.${extension}`)).toBe(true);
    });

    test("should return false for non-GraphQL extensions", () => {
      expect(isGraphqlFileExtension("file.txt")).toBe(false);
      expect(isGraphqlFileExtension("file.js")).toBe(false);
    });

    test("should return false for files without extension", () => {
      expect(isGraphqlFileExtension("file")).toBe(false);
    });

    test("should return false for empty input", () => {
      expect(isGraphqlFileExtension("")).toBe(false);
    });

    test("should return true for GraphQL file in URL", () => {
      expect(isGraphqlFileExtension("https://example.com/schema.graphql?q=1")).toBe(true);
    });

    test("should return false for non-GraphQL file in URL", () => {
      expect(isGraphqlFileExtension("https://example.com/file.txt")).toBe(false);
    });
  });
});
