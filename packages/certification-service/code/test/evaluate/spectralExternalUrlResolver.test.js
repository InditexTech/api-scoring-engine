// SPDX-FileCopyrightText: 2024 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { configValue } = require("../../src/config/config");
const { createResolver } = require("../../src/evaluate/spectralExternalUrlResolver");
jest.mock("../../src/config/config", () => {
  const originalModule = jest.requireActual("../../src/config/config");
  return {
    __esModule: true,
    ...originalModule,
    configValue: jest.fn(),
  };
});

describe("Spectral external url resolver", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should create resolver", () => {
    configValue.mockReturnValue("Basic dXNlcjpwYXNz");

    const resolver = createResolver();

    expect(configValue).toHaveBeenCalledWith("cerws.spectral.external-ref-resolver.authorization-header");
    expect(resolver).toBeDefined();
    expect(Object.keys(resolver.resolvers)).toHaveLength(3);
    expect(resolver.resolvers).toStrictEqual(
      expect.objectContaining({
        https: { resolve: expect.any(Function) },
        http: { resolve: expect.any(Function) },
        file: { resolve: expect.any(Function) },
      }),
    );
  });

  test("Create resolver should return undefined when no config", () => {
    configValue.mockReturnValue(undefined);

    const resolver = createResolver();

    expect(configValue).toHaveBeenCalledWith("cerws.spectral.external-ref-resolver.authorization-header");
    expect(resolver).toBeUndefined();
  });
});
