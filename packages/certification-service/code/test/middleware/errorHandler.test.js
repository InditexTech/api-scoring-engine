// SPDX-FileCopyrightText: 2023 Inditex
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
    expect(ctx.body).toMatchObject({
      code: 404,
      description: "Resource not found",
      level: "ERROR",
      message: "Resource not found [404]",
    });
  });

  test("should handle AppError", async () => {
    const ctx = {};
    const next = jest.fn().mockRejectedValue(new AppError({ code: 502, message: "Error", status: 502 }));
    await errorHandler(ctx, next);
    expect(ctx.status).toBe(502);
    expect(ctx.body).toMatchObject({
      code: 502,
      description: "Bad gateway",
      level: "ERROR",
      message: "Error [502]",
    });
  });

  test("should handle Error", async () => {
    const ctx = {};
    const next = jest.fn().mockRejectedValue(new Error("Error"));
    await errorHandler(ctx, next);
    expect(ctx.status).toBe(500);
    expect(ctx.body).toMatchObject({
      code: 500,
      description: "Internal Server Error",
      level: "ERROR",
      message: "Error [500]",
    });
  });
});
