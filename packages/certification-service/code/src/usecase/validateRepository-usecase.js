const os = require("os");
const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const { getAppLogger } = require("../log");
const { extractFiles, downloadRepository } = require("../utils/downloadUtils");
const { RepositoryParser } = require("../evaluate/repository/repositoryParser");
const { VALIDATION_TYPE_OVERALL_SCORE } = require("../verify/types");
const { validateApi } = require("../verify/apiValidation");
const { generateRandomFolder } = require("../verify/lint");

const logger = getAppLogger();

module.exports.execute = async (url, validationType, isVerbose) => {
  let zipFile = null;
  let folderPath = generateRandomFolder();

  try {
    if (url && url.mimetype === "application/zip") {
      logger.info(`Received zip file ${url.filepath}`);
      zipFile = url.filepath;
    } else {
      zipFile = path.join(os.tmpdir(), `repo-${Date.now()}.zip`);
      logger.info(`Downloading ${url} to ${zipFile}`);
      await downloadRepository(url, zipFile);
    }
    await extractFiles(zipFile, folderPath);

    logger.info(`Parsing repository folder`);
    const children = fs.readdirSync(folderPath);
    if (children && children.length === 1) {
      folderPath = path.join(folderPath, children[0]);
    }

    const repositoryParser = new RepositoryParser(folderPath);
    const parsedRepository = await repositoryParser.parseRepositoryFolder();

    let results = await validateParsedRepository({
      parsedRepository,
      validationType,
      isVerbose,
    });

    if (!validationType || validationType === VALIDATION_TYPE_OVERALL_SCORE) {
      logger.info(`Calculating global rating`);
    }

    results.forEach(function (item, index) {
      this[index] = reOrderValidation(item);
    }, results);

    clearVerboseResultsIfNotVerbose(isVerbose, results);

    return results;
  } finally {
    cleanTempFiles(zipFile, folderPath);
  }
};

const validateParsedRepository = async ({ parsedRepository, validationType, isVerbose }) => {
  let results = [];
  for (const api of parsedRepository.apis) {
    const tempFolder = path.join(parsedRepository.rootFolder, "../");
    const fullPathTemp = path.join(tempFolder, "temp", api["definition-path"]);

    if (fs.existsSync(fullPathTemp)) {
      fs.rmdirSync(fullPathTemp, { recursive: true });
    }
    fs.mkdirSync(fullPathTemp, { recursive: true });
    fse.copySync(path.join(parsedRepository.rootFolder, api["definition-path"]), fullPathTemp, { overwrite: true });

    const singleResult = await validateApi(parsedRepository.rootFolder, api, validationType, isVerbose, fullPathTemp);
    results.push(singleResult);
  }

  return results;
};

const clearVerboseResultsIfNotVerbose = (isVerbose, results) => {
  if (!(isVerbose === true || isVerbose === "true")) {
    clearVerboseResults(results);
  }
};

const clearVerboseResults = (results) => {
  results.forEach((api) => {
    clearAPIVerboseResult(api.result);
  });
};

const clearAPIVerboseResult = (result) => {
  result.forEach((module) => {
    Object.entries(module).forEach(([k, value]) => {
      // module is object
      if (typeof value === "object") {
        Object.keys(value).forEach((key) => {
          if (key !== "validationType" && key !== "rating" && key !== "ratingDescription" && key !== "score") {
            if (value.hasOwnProperty(key)) {
              delete value[key];
            }
          }
        });
      }
    });
  });
};

const cleanTempFiles = (zipFile, folderPath) => {
  if (zipFile) {
    fs.unlink(zipFile, (err) => err && logger.error(err.message));
  }
  if (folderPath) {
    fs.rmdirSync(folderPath, { recursive: true });
  }
};

const reOrderValidation = (validation) => {
  let objectOrder = {
    validationDateTime: null,
  };

  return Object.assign(objectOrder, validation);
};
