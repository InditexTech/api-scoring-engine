const getValidationController = require("../../controllers/validation-controller");
const { timeout } = require("../../middleware/timeOut");

const validationRoutes = (router, prefix) => {
  router
    .post(`${prefix}/apis/validate`, timeout(120000), getValidationController.validate)
    .post(`${prefix}/apis/verify`, timeout(120000), getValidationController.validateFile);
};

module.exports = { validationRoutes };
