const { downloadRepository, extractFiles, moveFiles, deleteFiles } = require("../utils/downloadUtils");
const { join } = require("path");
const fs = require("fs");
const { LintRuleset } = require("../evaluate/lint/lintRuleset");
const { DocumentationRuleset } = require("../evaluate/documentation/documentationRuleset");
const { configValue } = require("../config/config");
const { getAppLogger } = require("../log");
const { generateRandomFolder } = require("../verify/lint");

const logger = getAppLogger();

module.exports.updateRulesRepository = async () => {
  let hasUpdated = false;

  let configDir = join(
    process.cwd(),
    configValue("cerws.common.rest.client.github-rest-client.lint-repository-folder"),
  );
  let linterConfigUrl = configValue("cerws.lint.linter-config-location-url");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  const tempFolder = generateRandomFolder();
  const zipName = linterConfigUrl.split("/").pop();
  try {
    await downloadRepository(linterConfigUrl, join(tempFolder, zipName));
    await extractFiles(join(tempFolder, zipName), tempFolder);
    await moveFiles(join(tempFolder, getRulesFolder(tempFolder), "rules"), configDir);
    await LintRuleset.updateKnownRulesets();
    DocumentationRuleset.updateKnownRulesets();
    hasUpdated = true;
  } catch (e) {
    logger.error(e.message);
  } finally {
    await deleteFiles(tempFolder);
  }
  return hasUpdated;
};

const getRulesFolder = (dir) => {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)[0];
};
