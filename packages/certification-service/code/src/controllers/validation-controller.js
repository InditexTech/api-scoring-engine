const { isValidValidateRequest, isValidValidateFileRequest } = require("./linter-validations");
const { getAppLogger } = require("../log");
const { AppError } = require("../utils/error");
const { httpStatusCodes } = require("../utils/httpStatusCodes");
const validateRepositoryUseCase = require("../usecase/validateRepository-usecase");
const validateFileUseCase = require("../usecase/validateFile-usecase");

const logger = getAppLogger();

module.exports.validate = async (ctx, next) => {
  const { isVerbose, validationType } = ctx.request.body;
  const url = (ctx.request.files && ctx.request.files.url) || ctx.request.body.url;

  const validationTypeNumber = parseInt(validationType);

  isValidValidateRequest({ url, validationType: validationTypeNumber });

  try {
    const results = await validateRepositoryUseCase.execute(url, validationTypeNumber, isVerbose);
    ctx.body = results;
    ctx.status = httpStatusCodes.HTTP_OK;
  } catch (e) {
    handleError(e, ctx);
  }
  await next();
};

module.exports.validateFile = async (ctx, next) => {
  const url = (ctx.request.files && ctx.request.files.url) || ctx.request.body.url;
  const { apiProtocol } = ctx.request.body;

  const apiProtocolNumber = parseInt(apiProtocol);
  isValidValidateFileRequest({ url, apiProtocol: apiProtocolNumber });
  try {
    const result = await validateFileUseCase.execute(url, apiProtocolNumber);
    ctx.body = result;
    ctx.status = httpStatusCodes.HTTP_OK;
  } catch (e) {
    logger.error(e.message);
    handleError(e, ctx);
  }
  await next();
};

const handleError = (e, ctx) => {
  logger.error(e.toString());

  if (e instanceof AppError) {
    throw e;
  }

  throw new AppError({
    code: 500,
    message:
      e.response && e.response.status == 401 ? "The internal credentials are not correct or have expired" : e.message,
    status: httpStatusCodes.HTTP_INTERNAL_SERVER_ERROR,
  });
};
