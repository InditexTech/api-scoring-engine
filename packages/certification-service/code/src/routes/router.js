// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const Router = require("@koa/router");
const { healthCheckRoutes } = require("./health/healthcheck");
const { swaggerDocs } = require("./swagger/swagger");
const { validationRoutes } = require("./validations/validationsRoutes");

const router = new Router();
const apifirtsV1Prefix = "/apifirst/v1";

validationRoutes(router, apifirtsV1Prefix);
swaggerDocs(router);
healthCheckRoutes(router);

module.exports = { router };
