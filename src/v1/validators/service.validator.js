const { body, param, validateRequest } = require("./validator");

const createServiceValidation = validateRequest([
  body("service_name")
    .isLength({ min: 6, max: 100 })
    .withMessage("Name service must be between 6 and 20 characters"),

  body("service_alias")
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage("Alias must be between 1 and 20 characters"),

  body("service_description")
    .isLength({ min: 6, max: 500 })
    .withMessage("Description service must be between 6 and 20 characters"),
]);

const readServiceValidation = validateRequest([
  param("service_id")
    .optional()
    .custom((value) => {
      if (typeof value === "string") {
        if (!value.trim()) {
          throw new Error("service alias must not be empty");
        }
      } else if (typeof value === "number") {
        if (!Number.isInteger(value) || value <= 0) {
          throw new Error("service ID must be a positive integer greater than 0");
        }
      } else {
        throw new Error("Invalid service identifier format");
      }
      return true;
    }),
]);

const readServiceStoreValidation = validateRequest([
  param("owner_id")
    .custom((value) => {
      if (typeof value === "string") {
        if (!value.trim()) {
          throw new Error("Owner alias must not be empty");
        }
      } else if (typeof value === "number") {
        if (!Number.isInteger(value) || value <= 0) {
          throw new Error("Owner ID must be a positive integer greater than 0");
        }
      } else {
        throw new Error("Invalid owner identifier format");
      }
      return true;
    }),
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

  body("service_alias")
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage("Alias must be between 1 and 20 characters"),

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
  readServiceStoreValidation,
};
