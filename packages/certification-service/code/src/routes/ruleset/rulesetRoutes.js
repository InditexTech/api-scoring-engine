const getRulesetController = require("../../controllers/ruleset-controller");
const { timeout } = require("../../middleware/timeOut");

const rulesetRoutes = (router, prefix) => {
  router.post(`${prefix}/rulesets/refresh`, timeout(30000), getRulesetController.refreshRulesets);
};

module.exports = { rulesetRoutes };
