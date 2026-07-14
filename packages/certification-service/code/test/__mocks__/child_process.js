// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const child_process = jest.createMockFromModule("child_process");
jest.spyOn(child_process, "exec").mockImplementation();
jest.spyOn(child_process, "execFile").mockImplementation();

module.exports = child_process;
