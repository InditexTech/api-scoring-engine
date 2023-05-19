const { getAppLogger } = require("../log");
const { AppError } = require("../utils/error");
const { httpStatusCodes } = require("../utils/httpStatusCodes");

const logger = getAppLogger();

module.exports.errorHandler = async (ctx, next) => {
  try {
    await next();
    if (ctx.status === httpStatusCodes.HTTP_NOT_FOUND) {
      throw new AppError({
        code: httpStatusCodes.HTTP_NOT_FOUND,
        message: httpStatusCodes.reason(httpStatusCodes.HTTP_NOT_FOUND),
        status: httpStatusCodes.HTTP_NOT_FOUND,
      });
    }
  } catch (e) {
    const status = e.status || httpStatusCodes.HTTP_INTERNAL_SERVER_ERROR;
    const error = {
      code: status,
      description: httpStatusCodes.reason(status),
      level: "ERROR",
      message: `${e.message} [${status}]`,
    };
    if (e instanceof AppError) {
      error.error = {
        message: e.message,
        type: "AppError",
        code: e.code,
        ...(e.errors && { errors: e.errors }),
      };
    } else {
      error.error = {
        message: e.message,
        type: e.name,
        code: "UNKNOWN_ERROR",
      };
    }
    if (e.stack) {
      logger.error(e.stack.split("\n"));
    }

    ctx.status = status;
    ctx.body = error;
  }
};
