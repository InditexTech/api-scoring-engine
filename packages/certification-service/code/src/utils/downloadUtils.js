// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const fs = require("fs");
const fse = require("fs-extra");
const axios = require("axios");
const https = require("https");
const extractZip = require("extract-zip");
const { configValue } = require("../config/config");

const { getAppLogger } = require("../log");
const { AppError } = require("./error");

const agent = new https.Agent({
  rejectUnauthorized: false,
});

const MAX_ZIP_FILES = 10000;
const MAX_ZIP_FILES_SIZE = 50000000; // 50MB
const THRESHOLD_RATIO = 100; // this is too much but many repos need a this

const logger = getAppLogger();

const includeCommitInRepositoryUrl = (commit, repositoryUrl) => {
  const repositoryUrlObj = new URL(repositoryUrl);
  if (
    repositoryUrlObj.hostname === "github.com" ||
    repositoryUrlObj.hostname === "raw.githubusercontent.com" ||
    repositoryUrlObj.hostname === "localhost"
  ) {
    return repositoryUrl
      .substring(0, repositoryUrl.indexOf("/archive/refs/heads/"))
      .concat("/archive/", commit, ".zip");
  }
};

const downloadRepository = (url, targetFile) => {
  const urlObj = new URL(url);
  let writer;
  let auth = getHostAuth(urlObj);
  logger.info(`Downloading url ${url} to file ${targetFile}`);
  return axios
    .get(url, {
      httpsAgent: agent,
      auth: auth,
      responseType: "stream",
    })
    .then((response) => {
      writer = fs.createWriteStream(targetFile);
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        response.data.on("end", () => {
          resolve();
        });

        response.data.on("error", () => {
          reject();
        });
      });
    })
    .catch((error) => {
      throw error;
    })
    .finally(() => {
      if (writer) writer.close();
    });
};

const extractFiles = async (sourceFile, targetFolder) => {
  logger.info(`Extracting file ${sourceFile} to ${targetFolder}`);
  let totalSize,
    fileCount = 0;
  return extractZip(sourceFile, {
    dir: targetFolder,
    onEntry: function (entry, zipfile) {
      fileCount++;
      if (fileCount > MAX_ZIP_FILES) {
        throw new AppError({ code: 400, message: "Reached max. number of files" });
      }

      // The uncompressedSize comes from the zip headers, so it might not be trustworthy.
      // Alternatively, calculate the size from the readStream.
      const entrySize = entry.uncompressedSize;
      totalSize += entrySize;
      if (totalSize > MAX_ZIP_FILES_SIZE) {
        throw new AppError({ code: 400, message: "Reached max. size" });
      }

      if (entry.compressedSize > 0) {
        const compressionRatio = entrySize / entry.compressedSize;
        if (compressionRatio > THRESHOLD_RATIO) {
          throw new AppError({ code: 400, message: "Reached max. compression ratio " + compressionRatio });
        }
      }
    },
  });
};

const downloadFile = async (url, targetFile) => {
  const urlObj = new URL(url);
  let auth = getHostAuth(url, urlObj);
  logger.info(`Downloading url ${url} to file ${targetFile}`);
  const response = await axios.get(url, {
    httpsAgent: agent,
    auth: auth,
  });
  fs.writeFileSync(targetFile, response.data);
  logger.info(`File ${targetFile} written`);
};

const getHostAuth = (urlObj) => {
  if (urlObj.hostname === "github.com" || urlObj.hostname === "raw.githubusercontent.com") {
    return {
      username: configValue("cerws.common.rest.client.github-rest-client.username"),
      password: configValue("cerws.common.rest.client.github-rest-client.password"),
    };
  }
};

const moveFiles = async (srcFolder, destFolder) => {
  await fse.moveSync(srcFolder, destFolder, { overwrite: true });
};

const deleteFiles = async (srcFolder) => {
  await fse.remove(srcFolder);
};

module.exports = {
  downloadRepository,
  extractFiles,
  downloadFile,
  includeCommitInRepositoryUrl,
  moveFiles,
  deleteFiles,
};
