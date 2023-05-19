const fs = require("fs");

const checkFileExists = async (filePath) => {
  return fs.promises
    .access(filePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

module.exports = { checkFileExists };
