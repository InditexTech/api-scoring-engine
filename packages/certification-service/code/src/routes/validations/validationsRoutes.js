// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

const getValidationController = require("../../controllers/validation-controller");
const { timeout } = require("../../middleware/timeOut");

const validationRoutes = (router, prefix) => {
  router
    .post(`${prefix}/apis/validate`, timeout(120000), getValidationController.validate)
    .post(`${prefix}/apis/verify`, timeout(120000), getValidationController.validateFile);
};

module.exports = { validationRoutes };
