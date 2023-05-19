const path = require("path");
const fs = require("fs");
const { VALIDATION_TYPE_DESIGN } = require("./types");
const { cleanFileName } = require("./utils");
const { lintFilesWithProtolint } = require("./lint");

class gRPCLinter {
  static async lintgRPC(validationType, rootFolder, api, design, customFlags) {
    if (!validationType || validationType === VALIDATION_TYPE_DESIGN) {
      const apiFolder = path.join(rootFolder, api["definition-path"]);
      const pathFolders = fs.readdirSync(apiFolder);

      let folderFiles = pathFolders.filter(
          (item) =>
              !item.includes("metadata") &&
              !item.toUpperCase().includes("SUMMARY") &&
              !item.toUpperCase().includes("README") &&
              !item.endsWith(".png") &&
              !item.includes("stubs"),
      );
      const issues = await lintFilesWithProtolint(
          path.join(apiFolder + "/" + (folderFiles.length > 1 ? "" : folderFiles)),
          customFlags
      );

      issues.forEach((issue) => (issue.fileName = cleanFileName(issue.fileName, rootFolder)));
      design.designValidation.protolintValidation.issues.push(...issues);
    }
  }
}

module.exports = {
  gRPCLinter,
};
