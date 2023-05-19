const getValidationController = require("../../controllers/validation-controller");
const { timeout } = require("../../middleware/timeOut");

const validationRoutes = (router, prefix) => {
  router
    .post(`${prefix}/validations`, timeout(120000), getValidationController.validate)
    .post(`${prefix}/file-verify-protocol`, timeout(120000), getValidationController.validateFile);
};

module.exports = { validationRoutes };
