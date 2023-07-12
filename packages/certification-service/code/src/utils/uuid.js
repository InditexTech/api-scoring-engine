// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const { v4: uuidv4 } = require("uuid");

const uuid = () => {
  return uuidv4();
};

module.exports = {
  uuid,
};
