// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const fs = require("fs");
const path = require("path");

const Koa = require("koa");

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
  return server;
}

module.exports = { setUpHttpServer };
