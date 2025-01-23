// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const path = require("path");
const fs = require("fs");
const { VALIDATION_TYPE_DESIGN } = require("./types");
const { cleanFileName } = require("./utils");
const { lintFilesWithProtolint } = require("./lint");

class gRPCLinter {
  static async lintgRPC(validationType, apiDir, tempDir, design, customFlags) {
    if (!validationType || validationType === VALIDATION_TYPE_DESIGN) {
      const pathFolders = fs.readdirSync(apiDir);

      let folderFiles = pathFolders.filter(
          (item) =>
              !item.includes("metadata") &&
              !item.toUpperCase().includes("SUMMARY") &&
              !item.toUpperCase().includes("README") &&
              !item.endsWith(".png") &&
              !item.includes("stubs"),
      );
      const issues = await lintFilesWithProtolint(
        path.join(apiDir + "/" + (folderFiles.length > 1 ? "" : folderFiles)),
        customFlags,
      );

      issues.forEach((issue) => (issue.fileName = cleanFileName(issue.fileName, tempDir)));
      design.designValidation.protolintValidation.issues.push(...issues);
    }
  }
}

module.exports = {
  gRPCLinter,
};
