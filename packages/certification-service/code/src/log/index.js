const { Logger } = require("./logger");
const { configValue } = require("../config/config");

const instances = {};
const appName = configValue("app.name");
const level = configValue("cerws.log.level");

const getAppLogger = (pkg) => {
  const key = pkg || appName;
  if (!instances[key]) {
    instances[key] = new Logger(key, { level });
  }
  return instances[key];
};

module.exports = {
  getAppLogger,
};
