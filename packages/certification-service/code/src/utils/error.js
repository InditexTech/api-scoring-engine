// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { httpStatusCodes } = require("./httpStatusCodes");

class AppError extends Error {
  constructor(params = {}) {
    super(params.message);

    const { code, message, status, ...rest } = params;
    this.name = this.constructor.name;
    this.code = code;
    this.message = message || "error";
    this.status = status || httpStatusCodes.HTTP_INTERNAL_SERVER_ERROR;
    Object.assign(this, rest);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

module.exports = { AppError };
