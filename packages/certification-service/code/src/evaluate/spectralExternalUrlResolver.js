// SPDX-FileCopyrightText: 2024 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { Resolver } = require("@stoplight/json-ref-resolver");
const { resolveFile, createResolveHttp } = require("@stoplight/json-ref-readers");
const { configValue } = require("../config/config");
const { getAppLogger } = require("../log");
const logger = getAppLogger();

const resolveHttp = (resolverAuthHeader) => {
  return createResolveHttp({
    headers: {
      Authorization: resolverAuthHeader,
    },
  });
};

const createResolver = () => {
  const resolverAuthHeader = configValue("cerws.spectral.external-ref-resolver.authorization-header");
  if (resolverAuthHeader) {
    logger.info("Using custom http resolver");
    const httpResolver = resolveHttp(resolverAuthHeader);
    return new Resolver({
      resolvers: {
        https: { resolve: httpResolver },
        http: { resolve: httpResolver },
        file: { resolve: resolveFile },
      },
    });
  }
  return undefined;
};

module.exports = {
  createResolver,
};
