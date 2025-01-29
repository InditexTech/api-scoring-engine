// SPDX-FileCopyrightText: 2025 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0
const { cleanFileName } = require("../verify/utils");

const fromSpectralIssue = (issue, filePath, tempDir) => {
  return {
    fileName: cleanFileName(filePath, tempDir),
    code: issue.code,
    message: issue.message,
    severity: issue.severity,
    range: {
      start: {
        line: issue.range?.start?.line,
        character: issue.range?.start?.character,
      },
      end: {
        line: issue.range?.end?.line,
        character: issue.range?.end?.character,
      },
    },
    path: issue.path,
  };
};

const fromProtlintIssue = (issue, filePath, tempDir) => {
  return {
    fileName: cleanFileName(filePath, tempDir),
    code: issue.rule,
    message: issue.message,
    severity: issue.severity,
    range: {
      start: {
        line: issue.line,
        character: issue.column,
      },
      end: {
        line: issue.line,
        character: issue.column,
      },
    },
    path: [],
  };
};

const fromMarkdownlintIssue = (issue) => {
  return {
    fileName: issue.fileName,
    code: issue.ruleNames.join(", "),
    message: issue.ruleDescription,
    severity: issue.severity,
    range: {
      start: {
        line: issue.lineNumber,
        character: 1,
      },
      end: {
        line: issue.lineNumber,
        character: 1,
      },
    },
    path: [],
    ruleInformation: issue.ruleInformation,
  };
};

const fromEslintIssue = (issue, filePath, tempDir) => {
  return {
    fileName: cleanFileName(filePath, tempDir),
    code: issue.messageId || issue.ruleId,
    message: issue.message,
    severity: issue.customSeverity,
    range: {
      start: {
        line: issue.line,
        character: issue.column,
      },
      end: { line: issue.endLine, character: issue.endColumn },
    },
    path: [],
  };
};

module.exports = {
  fromSpectralIssue,
  fromProtlintIssue,
  fromMarkdownlintIssue,
  fromEslintIssue,
};
