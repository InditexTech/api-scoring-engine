const { Logger } = require("../../src/log/logger");
const { logRequest } = require("../../src/middleware/logRequest");
const { AppError } = require("../../src/utils/error");

const loggerInfoMock = jest.spyOn(Logger.prototype, "info").mockImplementation((msg) => {
  // eslint-disable-next-line no-console
  console.log(msg);
});

describe("LogRequest middleware test", () => {
  afterEach(() => {
    loggerInfoMock.mockClear();
  });

  test("should log request", async () => {
    const ctx = { response: {} };
    const next = jest.fn();
    await logRequest(ctx, next);
    expect(next).toHaveBeenCalled();
    expect(loggerInfoMock).toHaveBeenCalledTimes(2);
  });

  test("should log request and rethrow error", async () => {
    const ctx = { response: {} };
    const next = jest.fn().mockRejectedValue(new AppError({ code: 500, message: "Error", status: 500 }));
    await expect(logRequest(ctx, next)).rejects.toThrow(AppError);
    expect(next).toHaveBeenCalled();
    expect(loggerInfoMock).toHaveBeenCalledTimes(2);
  });
});
