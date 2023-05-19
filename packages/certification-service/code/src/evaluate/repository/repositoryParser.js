const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { checkFileExists } = require("../../utils/fileUtils");
const { getAppLogger } = require("../../log");
const { AppError } = require("../../utils/error");
const { httpStatusCodes } = require("../../utils/httpStatusCodes");

const logger = getAppLogger();
const protocols = ["rest", "event", "grpc"];

class RepositoryParser {
  folder;

  constructor(folder) {
    this.folder = folder;
  }

  async parseRepositoryFolder() {
    logger.info(`Parsing repository folder at ${this.folder}`);

    let parsedData = await this.identifyAPIs(this.folder);
    parsedData.markdowns = [];
    parsedData.markdowns.push.apply(parsedData.markdowns, await RepositoryParser.addDefaultMarkdowns(this.folder));

    parsedData.apis = parsedData.apis.filter((x) => protocols.includes(x["api-spec-type"].toLowerCase()));

    logger.info(`Parsed APIs: ` + parsedData.apis.map((api) => `'${api.name}/${api["api-spec-type"]}'`).join(", "));

    return parsedData;
  }

  async identifyAPIs() {
    logger.info(`Parsing repository folder at ${this.folder}`);
    let parsedData = {
      rootFolder: this.folder,
      apis: [],
    };
    parsedData.apis = await this.loadAPIs(this.folder);

    return parsedData;
  }

  async loadAPIs() {
    logger.info("Root metadata.yml detected!");

    let metadata = await this.loadMetadata(path.join(this.folder, "metadata.yml"));
    let apis = [];

    for (let api of metadata.apis) {
      apis.push(api);
    }

    return apis;
  }

  async loadMetadata(pathToFile) {
    return fs.promises
      .readFile(pathToFile)
      .then((data) => {
        return yaml.load(data.toString());
      })
      .catch((error) => {
        logger.error(`Can not read yml at ${pathToFile}: ${error.message}`);
        throw new AppError({
          code: httpStatusCodes.HTTP_UNPROCESSABLE_ENTITY,
          message: "Cannot read metadata.yml repository",
          status: httpStatusCodes.HTTP_UNPROCESSABLE_ENTITY,
        });
      });
  }

  static async addDefaultMarkdowns(folder) {
    const markdowns = [];

    markdowns.push.apply(markdowns, await RepositoryParser.addMarkdownFile(folder, "README.md"));

    return markdowns;
  }

  static async addMarkdownFile(folder, fileName) {
    const markdown = [];
    let filePath = path.join(folder, fileName);

    if (await checkFileExists(filePath)) {
      markdown.push(filePath);
    }

    return markdown;
  }
}

module.exports = { RepositoryParser };
