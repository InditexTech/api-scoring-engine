// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

module.exports = (input, options, { path }) => {
  for (let key in input.servers) {
    if (input.info.version.substring(0, 1) != input.servers[key].url.substring(input.servers[key].url.length - 1)) {
      return [
        {
          message: `url version should be v${input.info.version.substring(0, 1)}`,
          path: ["servers"],
        },
      ];
    }
  }
};
