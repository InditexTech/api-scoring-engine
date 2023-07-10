// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const constants = require("../utils/constants");

const path = require("path");
var fs = require("fs");

const getFileStream = (filePath) => {
  const fileStream = fs.createReadStream(filePath);
  fileStream.on("error", () => {
    throw new Error(
      `${constants.ERROR_FILE_ACCESS_PREFIX_MESSAGE}${filePath}${constants.ERROR_FILE_ACCESS_SUFFIX_MESSAGE}`
    );
  });

  return fileStream;
};

const writeOutputJson = (outputFolder, filename, value) => {
  fs.writeFileSync(
    path.join(outputFolder, filename).toString(),
    JSON.stringify(value, null, 4),
    constants.UTF8_ENCODING,
    function (err) {
      if (err) {
        console.warn(constants.ERROR_WRITING_JSON_TO_FILE_MESSAGE, err);
      }
    }
  );
};

module.exports = {
  getFileStream,
  writeOutputJson,
};
