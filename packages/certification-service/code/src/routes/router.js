const Router = require("@koa/router");
const { healthCheckRoutes } = require("./health/healthcheck");
const { rulesetRoutes } = require("./ruleset/rulesetRoutes");
const { swaggerDocs } = require("./swagger/swagger");
const { validationRoutes } = require("./validations/validationsRoutes");

const router = new Router();
const apifirtsV1Prefix = "/apifirst/v1";

validationRoutes(router, apifirtsV1Prefix);
rulesetRoutes(router, apifirtsV1Prefix);
swaggerDocs(router);
healthCheckRoutes(router);

module.exports = { router };
