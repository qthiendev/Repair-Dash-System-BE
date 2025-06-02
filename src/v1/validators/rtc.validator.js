const { body, param, validateRequest } = require("./validator");

const readSessionValidation = validateRequest([
	param("session_id").isString().withMessage("Must include session ID"),
]);

const updateSessionValidation = validateRequest([
	param("session_id").isString().withMessage("Must include session ID"),

	body("message")
		.isString()
		.isLength({ min: 1 })
		.withMessage("Message must be at least 1 character"),
]);

module.exports = {
	readSessionValidation,
	updateSessionValidation,
};
