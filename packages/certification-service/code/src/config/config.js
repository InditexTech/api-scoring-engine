const config = require("config");

const configValue = (property, defaultValue) => {
  if (!config.has(property)) {
    return defaultValue;
  }
  return config.get(property);
};

module.exports = {
  configValue,
};
