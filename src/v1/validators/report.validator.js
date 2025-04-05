const { body, param, validateRequest } = require("./validator");

const createReportValidation = validateRequest([
  body("report_description")
    .isLength({ min: 10, max: 100 })
    .withMessage("Description report must be between 6 and 100 characters"),
]);

const readReportValidation = validateRequest([
  param("report_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Report ID must be a positive integer or greater than 0"),
]);

const deleteReportValidation = validateRequest([
  param("report_id")
    .isInt({ min: 1 })
    .withMessage("Service ID must be a positive integer or greater than 0"),
]);

module.exports = {
  createReportValidation,
  readReportValidation,
  deleteReportValidation
};
