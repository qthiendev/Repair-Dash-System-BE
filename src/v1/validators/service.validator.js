const { body, param, validateRequest } = require("./validator");

const createServiceValidation = validateRequest([
  body("service_name")
    .isLength({ min: 6, max: 100 })
    .withMessage("Name service must be between 6 and 20 characters"),

  body("service_description")
    .isLength({ min: 6, max: 500 })
    .withMessage("Description service must be between 6 and 20 characters"),
]);

const readServiceValidation = validateRequest([
  param("service_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Service ID must be a positive integer or greater than 0"),
]);

const deleteServiceValidation = validateRequest([
  param("service_id")
    .isInt({ min: 1 })
    .withMessage("Service ID must be a positive integer or greater than 0"),
]);

const updateServiceValidation = validateRequest([
  param("service_id")
    .isInt({ min: 1 })
    .withMessage("Service ID must be a positive integer or greater than 0"),

  body("service_name")
    .optional()
    .isLength({ min: 6, max: 100 })
    .withMessage("Name must be between 6 and 20 characters"),

  body("service_description")
    .optional()
    .isLength({ min: 6, max: 500 })
    .withMessage("Description must be between 6 and 20 characters"),
]);

module.exports = {
  createServiceValidation,
  readServiceValidation,
  deleteServiceValidation,
  updateServiceValidation,
};
