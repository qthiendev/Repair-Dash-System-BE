const { body, param, validateRequest } = require("./validator");

const createEmployeeValidation = validateRequest([
	body("employee_full_name")
		.isLength({ min: 6, max: 100 })
		.withMessage("Name employee must be between 6 and 20 characters"),
]);

const readEmployeeValidation = validateRequest([
	param("employee_id")
		.optional()
		.isInt({ min: 1 })
		.withMessage(
			"Employee ID must be a positive integer or greater than 0",
		),
]);

const updateEmployeeValidation = validateRequest([
	param("employee_id")
		.isInt({ min: 1 })
		.withMessage(
			"Employee ID must be a positive integer or greater than 0",
		),

	body("employee_full_name")
		.isLength({ min: 6, max: 100 })
		.withMessage("Name employee must be between 6 and 20 characters"),
]);

const deleteEmployeeValidation = validateRequest([
	param("employee_id")
		.isInt({ min: 1 })
		.withMessage(
			"Employee ID must be a positive integer or greater than 0",
		),
]);

module.exports = {
	createEmployeeValidation,
	readEmployeeValidation,
	updateEmployeeValidation,
	deleteEmployeeValidation,
};
