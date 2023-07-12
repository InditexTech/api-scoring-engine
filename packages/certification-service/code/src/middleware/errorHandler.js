// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

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
      status: status,
      title: httpStatusCodes.reason(status),
      detail: `${e.message} [${status}]`,
    };
    if (e instanceof AppError) {
      error.errors = e.errors;
    } else {
      error.errors = [
        {
          code: httpStatusCodes.HTTP_INTERNAL_SERVER_ERROR,
          description: e.name,
          level: "ERROR",
          message: e.message,
        },
      ];
    }
    if (e.stack) {
      logger.error(e.stack.split("\n"));
    }

    ctx.status = status;
    ctx.body = error;
  }
};
