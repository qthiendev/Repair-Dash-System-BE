const createEmployee = require("../services/employee/createEmployee.service");
const readEmployee = require("../services/employee/readEmployee.service");
const updateEmployee = require("../services/employee/updateEmployee.service");
const deleteEmployee = require("../services/employee/deleteEmployee.service");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Create a new employee.
 * @route POST /api/v1/employees
 * @body {string} employee_full_name -(required)
 * @body {file} avatar_image (optional)
 * @returns {Object} 201 - { employeeId: number } if created successfully
 * @returns {Object} 400 - { message: 'Owner not found' } if the service is already registered
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } if an internal error happens
 */
exports.createEmployee = async (req, res) => {
	try {
		const owner_id = jwt.verify(
			req.cookies?.accessToken,
			process.env.JWT_SECRET_KEY,
		).user_id;

		const { employee_full_name, avatar_image } = req.body;

		const employee_id = await createEmployee(
			owner_id,
			employee_full_name,
			avatar_image,
		);

		switch (employee_id) {
			case -1:
				return res
					.status(400)
					.json({ message: "Owner not found.", code: -1 });
			default:
				return res.status(201).json({
					message: "Employee created successfully",
					employee_id,
				});
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Unexpected error occurred" });
	}
};

/**
 * Retrieve employee(s).
 * @route GET /api/v1/employees/:employee_id
 * @param {string} [employee_id] - (Optional) The ID of the employee to retrieve. If omitted, returns all employees.
 * @returns {Object} 200 - { employees } if employees are found
 * @returns {Object} 404 - { message: 'Employee not found' } if no service matches the given ID
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal server errors
 */
exports.readEmployeeStore = async (req, res) => {
	try {
		const owner_id = jwt.verify(
			req.cookies?.accessToken,
			process.env.JWT_SECRET_KEY,
		).user_id;

		const { employee_id } = req.params;

		let { current_page, limit } = req.query;

		current_page = Number(current_page);
		limit = Number(limit) || 10;

		if (isNaN(current_page) || current_page < 1) current_page = 1;

		const employees = await readEmployee(
			owner_id,
			employee_id,
			current_page,
			limit,
		);

		if (employees === -1) {
			return res.status(404).json({ message: "Employee not found" });
		}

		return res.status(200).json(employees);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Unexpected error occurred" });
	}
};

/**
 * Update employee details.
 * @route PUT /api/v1/employees/:employee_id
 * @param {string} employee_id - The ID of the employee to update.
 * @body {string} [employee_full_name] - Updated employee name (optional)
 * @body {file} [avatar_image] (optional)
 * @returns {Object} 200 - { message: 'Employee updated successfully' } if the update was successful
 * @returns {Object} 404 - { message: 'Employee not found' } if no employee with the given ID exists
 * @returns {Object} 501 - { message: 'Cannot update employee' } if the employee was not updated
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal errors
 */
exports.updateEmployee = async (req, res) => {
	try {
		const owner_id = jwt.verify(
			req.cookies?.accessToken,
			process.env.JWT_SECRET_KEY,
		).user_id;

		const { employee_id } = req.params;

		let { current_page, limit } = req.query;

		current_page = Number(current_page);
		limit = Number(limit) || 10;

		if (isNaN(current_page) || current_page < 1) current_page = 1;

		const { employee_full_name, avatar_image } = req.body;

		const result = await updateEmployee(
			owner_id,
			employee_id,
			employee_full_name,
			avatar_image,
			current_page,
			limit,
		);

		if (result === -1) {
			return res.status(404).json({ message: "Employee not found" });
		}

		if (!result) {
			return res.status(501).json({ message: "Cannot update employee" });
		}

		return res
			.status(200)
			.json({ message: "Employee updated successfully", result });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Unexpected error occurred" });
	}
};

/**
 * Soft delete a employee.
 * @route DELETE /api/v1/employees/:employee_id
 * @param {string} employee_id - The ID of the Employee to delete.
 * @returns {Object} 200 - { message: 'Employee deleted successfully' } if the employee was found and marked as deleted
 * @returns {Object} 404 - { message: 'Employee not found' } if no employee with the given ID exists
 * @returns {Object} 501 - { message: 'Cannot delete employee' } if the employee was not deleted
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal errors
 */
exports.deleteEmployee = async (req, res) => {
	try {
		const owner_id = jwt.verify(
			req.cookies?.accessToken,
			process.env.JWT_SECRET_KEY,
		).user_id;

		const { employee_id } = req.params;

		const result = await deleteEmployee(owner_id, employee_id);

		if (result === -1) {
			return res.status(404).json({ message: "Employee not found" });
		}

		if (!result) {
			return res.status(501).json({ message: "Cannot delete employee" });
		}

		return res
			.status(200)
			.json({ message: "Employee deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Unexpected error occurred" });
	}
};
