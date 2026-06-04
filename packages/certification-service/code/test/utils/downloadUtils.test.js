// SPDX-FileCopyrightText: 2026 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const os = require("os");
const path = require("path");
const { isZipEntryPathSafe } = require("../../src/utils/downloadUtils");

describe("downloadUtils tests", () => {
  describe("isZipEntryPathSafe", () => {
    const targetFolder = path.join(os.tmpdir(), "zip-target");

    test("should accept safe relative entry path", () => {
      expect(isZipEntryPathSafe("apis/openapi-rest.yml", targetFolder)).toBe(true);
    });

    test("should reject path traversal entry", () => {
      expect(isZipEntryPathSafe("../../etc/passwd", targetFolder)).toBe(false);
    });

    test("should reject absolute entry path", () => {
      expect(isZipEntryPathSafe("/etc/passwd", targetFolder)).toBe(false);
    });
  });
});
