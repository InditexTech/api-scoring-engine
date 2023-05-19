const path = require("path");
const { koaSwagger } = require("koa2-swagger-ui");
const { parseYaml } = require("../../utils/yamlUtils");

const swaggerDocs = (router) => {
  const spec = parseYaml(path.join(__dirname, "../../../api_spec/openapi-rest.yml"));

  router.get(
    "/docs",
    koaSwagger({
      routePrefix: false,
      swaggerOptions: { spec },
    }),
  );
};

module.exports = {
  swaggerDocs,
};
