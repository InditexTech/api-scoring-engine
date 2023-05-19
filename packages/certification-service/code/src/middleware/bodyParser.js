const { koaBody } = require("koa-body");
const { configValue } = require("../config/config");
const { AppError } = require("../utils/error");
const { httpStatusCodes } = require("../utils/httpStatusCodes");

module.exports.bodyParser = () => {
  return koaBody({
    multipart: true,
    parsedMethods: ["GET", "POST", "PUT", "PATCH", "HEAD", "DELETE"],
    formLimit: configValue("service.bodyParser.formLimit"),
    textLimit: configValue("service.bodyParser.textLimit"),
    jsonLimit: configValue("service.bodyParser.jsonLimit"),
    formidable: {
      maxFieldsSize: configValue("service.bodyParser.maxFieldsSize"),
      maxFileSize: configValue("service.bodyParser.maxFileSize"),
      uploadDir: configValue("service.bodyParser.uploadDir"),
    },
    onError: (error, ctx) => {
      throw new AppError({
        code: httpStatusCodes.HTTP_UNPROCESSABLE_ENTITY,
        message: error.message,
        status: httpStatusCodes.HTTP_UNPROCESSABLE_ENTITY,
      });
    },
  });
};
