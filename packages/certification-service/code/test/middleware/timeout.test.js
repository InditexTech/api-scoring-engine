// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const { timeout } = require("../../src/middleware/timeOut");

describe("TimeOut middleware test", () => {
  test("should throw request timeout", async () => {
    const ctx = { state: {} };
    const next = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 3);
      });

    try {
      await timeout(1)(ctx, next);
    } catch (e) {
      expect(e.status).toBe(504);
      expect(e.code).toBe("REQUEST_TIMEOUT");
      expect(e.message).toBe("Request timeout");
    }
    expect.assertions(3);
  });

  test("should not throw request timeout", async () => {
    const ctx = { state: {} };
    const next = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1);
      });

    await timeout(3)(ctx, next);
    expect(true).toBeDefined();
  });
});
