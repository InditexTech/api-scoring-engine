// SPDX-FileCopyrightText: 2024 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const markdownlint = require("markdownlint");
const path = require("path");
const { markdownEvaluate } = require("../../src/evaluate/markdownEvaluate");
const { DocumentationRuleset } = require("../../src/evaluate/documentation/documentationRuleset");
const { configValue } = require("../../src/config/config");

jest.mock("markdownlint");

describe("Tests Markdown Evaluation", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("Should call markdownlint with default config file", async () => {
    const config = {
      default: true,
      extends: null,
      MD013: false,
      severities: [
        {
          id: "MD025",
          severity: 1,
        },
      ],
    };
    const result = {
      "README.md": [
        {
          lineNumber: 1,
          ruleNames: ["EX_MD050", "custom-mandatory-about"],
          ruleDescription: "Mandatory About Section",
          ruleInformation: null,
          errorDetail: null,
          errorContext: "Section 'about' must exist",
          errorRange: null,
          fixInfo: null,
        },
        {
          lineNumber: 3,
          ruleNames: ["MD025", "single-title", "single-h1"],
          ruleDescription: "Multiple top-level headings in the same document",
          ruleInformation: "https://github.com/DavidAnson/markdownlint/blob/v0.34.0/doc/md025.md",
          errorDetail: null,
          errorContext: "# Top level heading",
          errorRange: null,
          fixInfo: null,
        },
      ],
    };
    jest.spyOn(markdownlint, "readConfigSync").mockReturnValue(config);
    jest.spyOn(markdownlint.promises, "markdownlint").mockResolvedValue(result);

    await markdownEvaluate("README.md", DocumentationRuleset.API.resolvedRuleset);

    expect(markdownlint.readConfigSync).toHaveBeenCalledWith(
      path.join(process.cwd(), configValue("cerws.markdown.markdown-lint-config")),
    );
    expect(markdownlint.promises.markdownlint).toHaveBeenCalledWith({
      files: ["README.md"],
      config: config,
      customRules: DocumentationRuleset.API.resolvedRuleset.all,
    });
  });

  test("Should call markdownlint with custom config file", async () => {
    const customConfig = {
      default: true,
      extends: null,
      MD013: false,
      MD001: false,
    };
    const result = {
      "README.md": [
        {
          lineNumber: 1,
          ruleNames: ["EX_MD050", "custom-mandatory-about"],
          ruleDescription: "Mandatory About Section",
          ruleInformation: null,
          errorDetail: null,
          errorContext: "Section 'about' must exist",
          errorRange: null,
          fixInfo: null,
        },
      ],
    };

    jest.spyOn(markdownlint.promises, "markdownlint").mockResolvedValue(result);

    await markdownEvaluate("README.md", DocumentationRuleset.API.resolvedRuleset, customConfig);

    expect(markdownlint.promises.markdownlint).toHaveBeenCalledWith({
      files: ["README.md"],
      config: customConfig,
      customRules: DocumentationRuleset.API.resolvedRuleset.all,
    });
  });
});
