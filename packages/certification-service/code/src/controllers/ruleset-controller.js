const refreshRulesetUseCase = require("../usecase/refreshRuleset-usecase");
const { httpStatusCodes } = require("../utils/httpStatusCodes");

module.exports.refreshRulesets = async (ctx, next) => {
  const hasUpdated = await refreshRulesetUseCase.execute();
  ctx.body = hasUpdated ? "Success" : "Failure";
  ctx.status = httpStatusCodes.HTTP_OK;

  await next();
};
