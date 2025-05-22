const { body, param, validateRequest } = require("./validator");

const loginValidation = validateRequest([
	body("identifier_email")
		.isEmail()
		.withMessage("Invalid email format")
		.isLength({ min: 5, max: 100 })
		.withMessage("Email must be between 5 and 100 characters"),

	body("password")
		.isLength({ min: 6, max: 20 })
		.withMessage("Password must be between 6 and 20 characters"),
]);

const registerValidation = validateRequest([
	body("identifier_email")
		.isEmail()
		.withMessage("Invalid email format")
		.isLength({ min: 5, max: 100 })
		.withMessage("Email must be between 5 and 100 characters"),

	body("password")
		.isLength({ min: 6, max: 20 })
		.withMessage("Password must be between 6 and 20 characters"),

	body("role")
		.isString()
		.isIn(["STORE", "CUSTOMER"])
		.withMessage("Role must be either STORE, or CUSTOMER"),

	body("user_full_name")
		.isString()
		.isLength({ min: 5, max: 200 })
		.withMessage("Full name must be between 5 and 200 characters"),

	body("user_phone_number")
		.isString()
		.isLength({ min: 10, max: 20 })
		.withMessage("Phone number must be between 10 and 20 characters"),

	body("user_street")
		.isString()
		.isLength({ min: 5 })
		.withMessage("Address must be at least 5 characters"),

	body("user_ward")
		.isString()
		.isLength({ min: 5 })
		.withMessage("Address must be at least 5 characters"),

	body("user_district")
		.isString()
		.isLength({ min: 5 })
		.withMessage("Address must be at least 5 characters"),

	body("user_city")
		.isString()
		.isLength({ min: 5 })
		.withMessage("Address must be at least 5 characters"),
]);

module.exports = {
	loginValidation,
	registerValidation,
};
