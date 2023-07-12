// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { errorHandler } = require("../../src/middleware/errorHandler");
const { AppError } = require("../../src/utils/error");

describe("Error handler middleware test", () => {
  test("should handle 404 error", async () => {
    const ctx = { status: 404 };
    const next = jest.fn();
    await errorHandler(ctx, next);
    expect(ctx.status).toBe(404);
    expect(ctx.body).toStrictEqual({
      status: 404,
      title: "Resource not found",
      detail: "Resource not found [404]",
      errors: undefined,
    });
  });

  test("should handle AppError", async () => {
    const ctx = {};
    const next = jest.fn().mockRejectedValue(new AppError({ code: 502, message: "Error", status: 502 }));
    await errorHandler(ctx, next);
    expect(ctx.status).toBe(502);
    expect(ctx.body).toStrictEqual({
      status: 502,
      title: "Bad gateway",
      detail: "Error [502]",
      errors: undefined,
    });
  });

  test("should handle Error", async () => {
    const ctx = {};
    const next = jest.fn().mockRejectedValue(new Error("Error"));
    await errorHandler(ctx, next);
    expect(ctx.status).toBe(500);
    expect(ctx.body).toStrictEqual({
      status: 500,
      title: "Internal Server Error",
      detail: "Error [500]",
      errors: [
        {
          code: 500,
          description: "Error",
          level: "ERROR",
          message: "Error",
        },
      ],
    });
  });
});
