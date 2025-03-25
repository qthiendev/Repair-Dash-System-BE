const { body, param, validateRequest } = require("./validator");

const updateProfileValidation = validateRequest([
  body("user_full_name")
    .optional()
    .isLength({ min: 6, max: 200 })
    .withMessage("Name must be between 6 and 200 characters"),

  body("user_phone_number")
    .optional()
    .isLength({ min: 10, max: 12 })
    .withMessage("Phone must be between 10 and 12 characters"),

  body("user_description")
    .optional()
    .isLength({ min: 6, max: 500 })
    .withMessage("Description must be between 6 and 20 characters"),

  body("user_street")
    .optional()
    .isLength({ min: 6, max: 500 })
    .withMessage("Street must be between 6 and 500 characters"),

  body("user_ward")
    .optional()
    .isLength({ min: 6, max: 500 })
    .withMessage("Ward must be between 6 and 500 characters"),

  body("user_district")
    .optional()
    .isLength({ min: 6, max: 500 })
    .withMessage("Street must be between 6 and 500 characters"),

  body("user_city")
    .optional()
    .isLength({ min: 6, max: 500 })
    .withMessage("Street must be between 6 and 500 characters"),

  body("user_priority")
    .optional()
    .isLength({ min: 6, max: 500 })
    .withMessage("Street must be between 6 and 500 characters"),
]);

module.exports = {
  updateProfileValidation,
};
