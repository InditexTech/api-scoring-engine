const Koa = require("koa");
const koaCompose = require("koa-compose");
const { logRequest } = require("./middleware/logRequest");
const { errorHandler } = require("./middleware/errorHandler");
const { getAppLogger } = require("./log");
const { configValue } = require("./config/config");
const { router } = require("./routes/router");
const { bodyParser } = require("./middleware/bodyParser");
const http = require("http");
const { LintRuleset } = require("./evaluate/lint/lintRuleset");
const { DocumentationRuleset } = require("./evaluate/documentation/documentationRuleset");

const init = async () => {
  const logger = getAppLogger();

  await LintRuleset.updateKnownRulesets();
  DocumentationRuleset.updateKnownRulesets();

  const app = new Koa();
  const server = http.createServer(app.callback());

  app.use(koaCompose([errorHandler, logRequest, bodyParser(), router.routes()]));

  server.listen(configValue("service.port"), () => {
    const { port } = server.address();
    logger.info(`App listen on port ${port}`);
  });
};

init();
