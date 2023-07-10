// SPDX-FileCopyrightText: 2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

const child_process = jest.createMockFromModule("child_process");
jest.spyOn(child_process, "exec").mockImplementation();

module.exports = child_process;
