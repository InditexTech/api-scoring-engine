// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { formatProtolint } = require("../../src/format/protolintFormatter");

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

const protolintSampleMultipleOutput =
  "{\n" +
  '  "lints": [\n' +
  "    {\n" +
  '      "filename": "../../../../../app-apidsg/apis/samples/grpc/product.proto",\n' +
  '      "line": 92,\n' +
  '      "column": 1,\n' +
  '      "message": "Enum name \\"Brand\\" must be underscore_separated_names",\n' +
  '      "rule": "ENUM_NAMES_LOWER_SNAKE_CASE",\n' +
  '      "severity": 1\n' +
  "    },\n" +
  "    {\n" +
  '      "filename": "../../../../../app-apidsg/apis/samples/grpc/product.proto",\n' +
  '      "line": 125,\n' +
  '      "column": 2,\n' +
  '      "message": "Enum name \\"Brand\\" must be underscore_separated_names",\n' +
  '      "rule": "ENUM_NAMES_LOWER_SNAKE_CASE",\n' +
  '      "severity": 1\n' +
  "    }]\n" +
  "}";

const protolintSampleNoViolations = "{\n" + '  "lints": null ' + "}";

const protolintFormatted = {
  column: 1,
  fileName: "../../../../../app-apidsg/apis/samples/grpc/product.proto",
  line: 92,
  rule: "ENUM_NAMES_LOWER_SNAKE_CASE",
  message: 'Enum name "Brand" must be underscore_separated_names',
  severity: 1,
};

const anotherProtolintFormatted = {
  column: 2,
  fileName: "../../../../../app-apidsg/apis/samples/grpc/product.proto",
  line: 125,
  rule: "ENUM_NAMES_LOWER_SNAKE_CASE",
  message: 'Enum name "Brand" must be underscore_separated_names',
  severity: 1,
};

describe("Tests Protolint Formatter", () => {
  test("protolint formatter when found a rule violation", () => {
    const evaluationResult = formatProtolint(protolintSampleOutput);

    expect(evaluationResult).toHaveLength(1);
    expect(evaluationResult).toBeDefined();
    expect(evaluationResult).toStrictEqual([protolintFormatted]);
  });

  test("protolint formatter when found 2 rules violations", () => {
    const evaluationResult = formatProtolint(protolintSampleMultipleOutput);

    expect(evaluationResult).toHaveLength(2);
    expect(evaluationResult).toBeDefined();
    expect(evaluationResult).toStrictEqual([protolintFormatted, anotherProtolintFormatted]);
  });

  test("protolint formatter when found no rule violations", () => {
    const evaluationResult = formatProtolint(protolintSampleNoViolations);

    expect(evaluationResult).toHaveLength(0);
    expect(evaluationResult).toBeDefined();
    expect(evaluationResult).toStrictEqual([]);
  });
});
