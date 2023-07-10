// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const os = require("os");
const fs = require("fs");
const path = require("path");
const tar = require("tar");
const axios = require("axios");

const BIN_PATH = "src/bin";

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const downloadFile = async (fileUrl) => {
  const fileName = new URL(fileUrl).pathname.split("/").pop();
  const filePath = path.join(os.tmpdir(), fileName);
  const response = await axios.get(fileUrl, { responseType: "stream" });
  response.data.pipe(fs.createWriteStream(filePath));
  return new Promise((resolve, reject) => {
    response.data.on("end", () => {
      console.log(`Downloaded file ${fileUrl} to ${filePath}`);
      resolve(filePath);
    });

    response.data.on("error", () => {
      reject();
    });
  });
};

const getProtolintUrls = () => {
  const packageJsonPath = path.join(".", "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error("Unable to find package.json. ");
  }
  const data = fs.readFileSync(packageJsonPath, "utf8");
  const packageJson = JSON.parse(data);
  const protolint = packageJson["protolint"];
  return {
    protolintUrl: protolint[`protolint-${process.platform}-${process.arch}`],
    protolintCustomRules: protolint[`protolint-custom-rules-${process.platform}-${process.arch}`],
  };
};

const extract = async (file, path) => {
  ensureDir(path);
  return new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(
        tar.x({
          cwd: path,
          filter: (file) => {
            return file.startsWith("protolint");
          },
        }),
      )
      .on("finish", () => {
        console.log(`Extracted ${file} into ${path}`);
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

const cleanUp = (files) => {
  files.forEach((file) => fs.unlinkSync(file));
};

const downloadAndExtractProtolint = async () => {
  const protolintUrls = getProtolintUrls();
  if (!protolintUrls.protolintUrl || !protolintUrls.protolintCustomRules) {
    throw new Error(`Protolint not supported for ${process.platform}-${process.arch}`);
  }

  const protolint = await downloadFile(protolintUrls.protolintUrl);
  await extract(protolint, BIN_PATH);

  // const customRules = await downloadFile(protolintUrls.protolintCustomRules);
  await extract(path.join(process.cwd(), protolintUrls.protolintCustomRules), BIN_PATH);
  cleanUp([protolint]);
};

(async () => {
  try {
    await downloadAndExtractProtolint();
  } catch (err) {
    console.error(err);
  }
})();
