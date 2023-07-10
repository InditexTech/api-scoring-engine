// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

module.exports = (schema, _, paths) => {
  if (!schema.status || schema.status.type !== "integer") {
    return [
      {
        message: `RFC-7807 Problem specification: status (integer) should be defined`,
      },
    ];
  }

  if (!schema.title || schema.title.type !== "string") {
    return [
      {
        message: `RFC-7807 Problem specification: title (string) should be defined`,
      },
    ];
  }

  if (!schema.detail || schema.detail.type !== "string") {
    return [
      {
        message: `RFC-7807 Problem specification: detail (string) should be defined`,
      },
    ];
  }
};
