const { updateRulesRepository } = require("../utils/rulesetUtils");
module.exports.execute = async () => {
  return updateRulesRepository();
};
