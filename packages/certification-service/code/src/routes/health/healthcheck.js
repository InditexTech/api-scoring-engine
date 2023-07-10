// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { httpStatusCodes } = require("../../utils/httpStatusCodes");

const healthCheckRoutes = (router) => {
  router
    .get("/health", (ctx) => {
      ctx.status = httpStatusCodes.HTTP_OK;
      ctx.body = "Alive!";
    })
    .get("/readiness", (ctx) => {
      ctx.status = httpStatusCodes.HTTP_OK;
      ctx.body = "Alive!";
    });
};

module.exports = { healthCheckRoutes };
