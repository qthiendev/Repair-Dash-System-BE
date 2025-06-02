const express = require("express");
const router = express.Router();

const {
	createEmployee,
	readEmployeeStore,
	updateEmployee,
	deleteEmployee,
} = require("../controllers/employee.controller");

const {
	createEmployeeValidation,
	readEmployeeValidation,
	updateEmployeeValidation,
	deleteEmployeeValidation,
} = require("../validators/employee.validator");

const { authenticate, ensureStore } = require("../middlewares/auth.middleware");

/**
 * @description RESTful API for store's employee.
 *
 * @route POST    /v1/employees          - Create a new employee
 * @route GET     /v1/employees/:employee_id? - Retrieve all employee
 * @route PUT     /v1/employees/:employee_id  - Update employee profile
 * @route DELETE  /v1/employees/:employee_id  - Soft delete a employee
 */
router.post(
	"/",
	authenticate,
	ensureStore,
	createEmployeeValidation,
	createEmployee,
);
router.get(
	"/:employee_id?",
	authenticate,
	ensureStore,
	readEmployeeValidation,
	readEmployeeStore,
);

router.put(
	"/:employee_id",
	authenticate,
	ensureStore,
	updateEmployeeValidation,
	updateEmployee,
);

router.delete(
	"/:employee_id",
	authenticate,
	ensureStore,
	deleteEmployeeValidation,
	deleteEmployee,
);

module.exports = router;
