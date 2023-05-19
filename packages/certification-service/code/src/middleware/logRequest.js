const { getAppLogger } = require("../log");
const { httpStatusCodes } = require("../utils/httpStatusCodes");

const { uuid } = require("../utils/uuid");

const logger = getAppLogger();

module.exports.logRequest = async (ctx, next) => {
  const reqId = uuid();
  logger.info(`${ctx.method} ${ctx.url} - Request (${reqId}) start`);
  const start = new Date();
  let status;
  try {
    await next();
    status = ctx.response.status;
  } catch (error) {
    status = error.status || httpStatusCodes.HTTP_INTERNAL_SERVER_ERROR;
    throw error;
  } finally {
    const ms = new Date() - start;
    logger.info(`${ctx.method} ${ctx.url} - Request (${reqId}) end after ${ms} ms [${status}]`);
  }
};
