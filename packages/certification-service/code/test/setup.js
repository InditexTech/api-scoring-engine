const fs = require("fs");
const path = require("path");

const Koa = require("koa");
const { LintRuleset } = require("../src/evaluate/lint/lintRuleset");
const { DocumentationRuleset } = require("../src/evaluate/documentation/documentationRuleset");

const app = new Koa();

async function setUpHttpServer() {
  app.use(async function (ctx) {
    const fpath = path.join(__dirname, ctx.path);

    if (fs.existsSync(fpath)) {
      ctx.type = path.extname(fpath);
      ctx.body = fs.createReadStream(fpath);
    }
  });
  const server = app.listen(8080);

  await LintRuleset.updateKnownRulesets();
  DocumentationRuleset.updateKnownRulesets();

  return server;
}

module.exports = { setUpHttpServer };
