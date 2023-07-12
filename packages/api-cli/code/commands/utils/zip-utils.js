// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const constants = require("../utils/constants");

const path = require("path");
const AdmZip = require("adm-zip");
var fs = require("fs");

const createZipWithValueDirectories = (workingDir) => {
  let zip = new AdmZip();
  var files = fs.readdirSync(workingDir);
  files.forEach((x) => {
    if (!constants.UNWANTED_DIRECTORIES.includes(x)) {
      if (fs.lstatSync(path.join(workingDir, x)).isFile()) {
        if (!x.endsWith(constants.VALIDATION_ZIP_FILE_EXTENSION)) {
          zip.addLocalFile(path.join(workingDir, x));
        }
      } else {
        zip.addLocalFolder(path.join(workingDir, x), x);
      }
    }
  });
  zip.writeZip(constants.VALIDATION_ZIP_FILE_NAME);

  const zipReadStream = fs.createReadStream(constants.VALIDATION_ZIP_PATH);
  zipReadStream.on("close", () => {
    fs.unlink(constants.VALIDATION_ZIP_PATH, function (err) {
      if (err) {
        console.warn(constants.ERROR_REMOVING_REPO_ZIP_MESSAGE, err);
      }
    });
  });

  return zipReadStream;
};

module.exports = {
  createZipWithValueDirectories,
};
