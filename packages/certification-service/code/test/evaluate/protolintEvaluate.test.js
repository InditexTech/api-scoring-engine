// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const cp = require("child_process");
const path = require("path");

const protolintEvaluate = require("../../src/evaluate/protolintEvaluate");

jest.mock("child_process");

const protolintSampleOutput =
  "{\n" +
  '  "lints": [\n' +
  "    {\n" +
  '      "filename": "../../../../../app-apidsg/apis/samples/grpc/product.proto",\n' +
  '      "line": 92,\n' +
  '      "column": 1,\n' +
  '      "message": "Enum name \\"Brand\\" must be underscore_separated_names",\n' +
  '      "rule": "ENUM_NAMES_LOWER_SNAKE_CASE",\n' +
  '      "severity": 1\n' +
  "    }]\n" +
  "}";

const protolintFormatted = {
  column: 1,
  fileName: "../../../../../app-apidsg/apis/samples/grpc/product.proto",
  line: 92,
  message: 'Enum name "Brand" must be underscore_separated_names',
  rule: "ENUM_NAMES_LOWER_SNAKE_CASE",
  severity: 1,
};

describe("Tests Protolint Evaluation", () => {
  test("Protolint on file with rule violations must return results with violations", async () => {
    const filePath = path.join(__dirname, "../data/bad.proto");

    cp.exec.mockImplementation((command, callback) => callback(null, protolintSampleOutput));

    const evaluationResult = await protolintEvaluate([filePath], new Map());

    expect(evaluationResult).toHaveLength(1);
    expect(evaluationResult).toBeDefined();
    expect(evaluationResult).toStrictEqual([protolintFormatted]);
  });

  test("Should return PROTOLINT_FAILED when failed Protolint", async () => {
    const filePath = path.join(__dirname, "../data/bad.proto");
    cp.exec.mockImplementation((command, callback) =>
      callback(null, 'Protolint output failed client.Client(), err=exec: "sh": executable file not found in %PATH%'),
    );
    const evaluationResult = await protolintEvaluate([filePath], new Map());
    expect(evaluationResult).toHaveLength(1);
    expect(evaluationResult[0].rule).toBe("PROTOLINT_FAILED");
  });
});
