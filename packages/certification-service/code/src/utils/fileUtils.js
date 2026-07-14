// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const fs = require("fs");
const path = require("path");
const { URL } = require("url");
const { configValue } = require("../config/config");
const GRAPHQL_FILE_EXTENSIONS = configValue("cerws.certification.protocol.GRAPHQL.file-extensions", [
  "graphql",
  "graphqls",
  "gql",
]);
const SAFE_MULTIPART_FILENAME_REGEX = /^[A-Za-z0-9._-]+$/;

const checkFileExists = async (filePath) => {
  return fs.promises
    .access(filePath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

const isGraphqlFileExtension = (file) => {
  if (!file) {
    return false;
  }
  let ext;
  try {
    const url = new URL(file);
    ext = path.extname(url.pathname);
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    ext = path.extname(file);
  }
  if (!ext) {
    return false;
  }
  return GRAPHQL_FILE_EXTENSIONS.includes(ext.substring(1, ext.length));
};

const hasSafeMultipartFilename = (fileName) => {
  if (!fileName || typeof fileName !== "string") {
    return false;
  }

  const trimmedFileName = fileName.trim();
  if (!trimmedFileName) {
    return false;
  }

  const normalizedFileName = path.basename(trimmedFileName);
  if (normalizedFileName !== trimmedFileName) {
    return false;
  }

  if (normalizedFileName.includes("..")) {
    return false;
  }

  return SAFE_MULTIPART_FILENAME_REGEX.test(normalizedFileName);
};

const sanitizeMultipartFilename = (fileName) => {
  if (!hasSafeMultipartFilename(fileName)) {
    return null;
  }

  return fileName.trim();
};

module.exports = { checkFileExists, isGraphqlFileExtension, hasSafeMultipartFilename, sanitizeMultipartFilename };
