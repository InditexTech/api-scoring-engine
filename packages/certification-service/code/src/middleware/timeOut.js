const { AppError } = require("../utils/error");
const { httpStatusCodes } = require("../utils/httpStatusCodes");

module.exports.timeout =
  (delay, options = {}) =>
  async (ctx, next) => {
    let timer;
    try {
      const code = "REQUEST_TIMEOUT";
      const status = options.status || httpStatusCodes.HTTP_GATEWAY_TIMEOUT;
      const message = options.message || "Request timeout";
      const timeout = new Promise((_, reject) => {
        timer = setTimeout(() => {
          ctx.state.timeout = true;
          reject(new AppError({ code, message, status }));
        }, delay);
      });
      await Promise.race([timeout, next()]);
    } finally {
      clearTimeout(timer);
    }
  };
