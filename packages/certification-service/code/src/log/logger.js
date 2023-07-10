// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { createLogger, format, transports } = require("winston");

const logFormat = (pkg) =>
  format.printf(({ level, message, label, timestamp }) => {
    return `${timestamp}  ${level.padEnd(17)}  ${pkg}  ${message}`;
  });

const consoleTransport = (pkg) =>
  new transports.Console({
    format: format.combine(format.colorize(), format.timestamp(), logFormat(pkg)),
  });

class Logger {
  constructor(pkg, config) {
    this.pkg = pkg;
    this.config = config;

    this.winstonLogger = createLogger({
      level: this.config.level,
      transports: consoleTransport(this.pkg),
    });
  }

  error(message) {
    if (this.winstonLogger.isErrorEnabled()) {
      this.winstonLogger.error(message);
    }
  }

  warn(message) {
    if (this.winstonLogger.isWarnEnabled()) {
      this.winstonLogger.warn(message);
    }
  }

  info(message) {
    if (this.winstonLogger.isInfoEnabled()) {
      this.winstonLogger.info(message);
    }
  }

  verbose(message) {
    if (this.winstonLogger.isVerboseEnabled()) {
      this.winstonLogger.verbose(message);
    }
  }

  debug(message) {
    if (this.winstonLogger.isDebugEnabled()) {
      this.winstonLogger.debug(message);
    }
  }

  silly(message) {
    if (this.winstonLogger.isSillyEnabled()) {
      this.winstonLogger.silly(message);
    }
  }
}

module.exports = {
  Logger,
};
