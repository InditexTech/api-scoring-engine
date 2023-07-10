// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

module.exports = (targetVal) => {
  function isObject(value) {
    return value && typeof value === "object" && value.constructor === Object;
  }

  if (Array.isArray(targetVal)) {
    if (targetVal.every((val) => "doc" in val)) {
      return;
    }
  } else if (isObject(targetVal)) {
    //Check if doc field is present and non-empty
    if ("doc" in targetVal && targetVal.doc != "") return;
  }

  return [
    {
      message: "Wrong data",
    },
  ];
};
