// SPDX-FileCopyrightText: 2024 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const fs = require("fs");
const { Resolver } = require("@stoplight/json-ref-resolver");
const { resolveHttp, createResolveHttp } = require("@stoplight/json-ref-readers");
const { configValue } = require("../config/config");
const { getAppLogger } = require("../log");
const logger = getAppLogger();

const createCustomResolveHttp = (resolverAuthHeader) => {
  return createResolveHttp({
    headers: {
      Authorization: resolverAuthHeader,
    },
  });
};

const createResolver = () => {
  const resolverAuthHeader = configValue("cerws.spectral.external-ref-resolver.authorization-header");
  let httpResolver = resolveHttp;
  if (resolverAuthHeader) {
    logger.info("Using custom http resolver");
    httpResolver = createCustomResolveHttp(resolverAuthHeader);
  }
  return new Resolver({
    resolvers: {
      https: { resolve: httpResolver },
      http: { resolve: httpResolver },
      file: {
        resolve(ref) {
          return new Promise((resolve, reject) => {            
            try {
              const refPath = ref.toString();
              const fileContent = fs.readFileSync(refPath, "utf8");
              resolve(fileContent);
            } catch (e) {
              reject(e);
            }
          });
        },
      },
    },
  });
};

module.exports = {
  createResolver,
};
