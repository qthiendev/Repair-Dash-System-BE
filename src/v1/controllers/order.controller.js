const readCheckoutService = require("../services/order/readCheckout.service");
const readOrderService = require("../services/order/readOrder.service");
const createOrderService = require("../services/order/createOrder.service");
const updateOrderService = require("../services/order/updateOrder.service");
const deleteOrderService = require("../services/order/deleteOrder.service");
const jwt = require("jsonwebtoken");
const terminal = require("../../utils/terminal");

require("dotenv").config();

/**
 * Retrieve checkout details for a customer and service.
 * @route GET /api/v1/checkout
 * @query {number} service_id - The ID of the service.
 * @header {string} Authorization - Bearer token containing user authentication.
 * @returns {Object} 200 - { checkout } if found
 * @returns {Object} 404 - { message: 'Customer not found' } if the customer ID is invalid
 * @returns {Object} 404 - { message: 'Store not found for this service' } if the store ID is invalid
 * @returns {Object} 404 - { message: 'Service not found' } if the service ID is invalid
 * @returns {Object} 404 - { message: 'Store not allow to order own service.' } if the store try order it own service
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal errors
 */
exports.readCheckout = async (req, res) => {
	try {
		const result = await readCheckoutService(
			await jwt.verify(
				req.cookies?.accessToken,
				process.env.JWT_SECRET_KEY,
			).user_id,
			req.params.service_id,
		);

		switch (result) {
			case -1:
				return res
					.status(404)
					.json({ message: "Customer not found.", code: -1 });
			case -2:
				return res
					.status(404)
					.json({ message: "Service not found.", code: -2 });
			case -3:
				return res.status(404).json({
					message: "Store not found for this service.",
					code: -3,
				});
			case -4:
				return res.status(403).json({
					message: "Store not allow to order own service.",
					code: -4,
				});
			default:
				return res.status(200).json({ checkout: result });
		}
	} catch (error) {
		terminal.error(
			`order.controller.js | Read Checkout Error: ${error.message}`,
		);
		res.status(500).json({ message: "Unexpected error occurred" });
	}
};

/**
 * Create a new order.
 * @route POST /api/v1/order
 * @body {number} service_id - The ID of the service.
 * @body {string} order_description - Description of the order.
 * @returns {Object} 201 - { message: 'Order created successfully', order }
 * @returns {Object} 400 - { message: 'Invalid service or customer' }
 * @returns {Object} 500 - { message: 'Unexpected error occurred' }
 */
exports.createOrder = async (req, res) => {
	try {
		const customer_id = jwt.verify(
			req.cookies?.accessToken,
			process.env.JWT_SECRET_KEY,
		).user_id;
		const {
			service_id,
			order_description,
			customer_full_name,
			customer_phone_number,
			customer_address,
			order_images,
		} = req.body;

		const order_id = await createOrderService(
			customer_id,
			service_id,
			customer_full_name,
			customer_phone_number,
			customer_address,
			order_description,
			order_images,
		);

		switch (order_id) {
			case -1:
				return res
					.status(400)
					.json({ message: "Customer not found.", code: -1 });
			case -2:
				return res
					.status(400)
					.json({ message: "Service not found.", code: -2 });
			case -3:
				return res
					.status(400)
					.json({ message: "Store not found.", code: -3 });
			case -4:
				return res.status(400).json({
					message: "Store not allowed to order its own service.",
					code: -4,
				});
			case -5:
				return res.status(403).json({
					message: "Total order is greater than current plan.",
					code: -5,
				});
			default:
				return res
					.status(201)
					.json({ message: "Order created successfully", order_id });
		}
	} catch (error) {
		terminal.error(
			`order.controller.js | Create Order Error: ${error.message}`,
		);
		res.status(500).json({ message: "Unexpected error occurred" });
	}
};

/**
 * Update an existing order with authorization.
 * @route PUT /api/v1/orders/:order_id
 * @returns {Object} 200 - { message: 'Order updated successfully', order }
 * @returns {Object} 403 - { message: 'You are not allowed to update this order' }
 * @returns {Object} 404 - { message: 'Order not found' }
 * @returns {Object} 400 - { message: 'Invalid employee' }
 * @returns {Object} 500 - { message: 'Unexpected error occurred' }
 */
exports.updateOrder = async (req, res) => {
	try {
		const { order_id } = req.params;
		const user_id = jwt.verify(
			req.cookies?.accessToken,
			process.env.JWT_SECRET_KEY,
		).user_id;
		const updateData = req.body;

		const result = await updateOrderService(order_id, user_id, updateData);

		switch (result) {
			case -1:
				return res
					.status(404)
					.json({ message: "Order not found", code: -1 });
			case -2:
				return res
					.status(400)
					.json({ message: "Employee not found", code: -2 });
			case -3:
				return res.status(403).json({
					message: "You are not allowed to update this order",
					code: -3,
				});
			case -4:
				return res.status(403).json({
					message: "Unauthorized to change this order",
					code: -4,
				});
			case -5:
				return res.status(400).json({
					message:
						"Order is COMPLETED, only order_feedback can be updated",
					code: -5,
				});
			case -6:
				return res.status(400).json({
					message: "Employee does not belong to this service owner.",
					code: -6,
				});
			default:
				return res.status(200).json({
					message: "Order updated successfully",
					order: result,
				});
		}
	} catch (error) {
		terminal.error(
			`order.controller.js | Update Order Error: ${error.message}`,
		);
		res.status(500).json({ message: "Unexpected error occurred" });
	}
};

/**
 * Retrieve all orders or a specific order.
 * @route GET /api/v1/orders/:order_id?
 * @param {number} [order_id] - (Optional) The ID of the order.
 * @returns {Object} 200 - { orders } if fetching all orders.
 * @returns {Object} 200 - { order } if fetching a specific order.
 * @returns {Object} 403 - { message: 'You are not allowed to read this order.' } if unauthorized.
 * @returns {Object} 404 - { message: 'Order not found' } if order_id is invalid.
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal errors.
 */
exports.readOrder = async (req, res) => {
	try {
		const { user_id } = jwt.verify(
			req.cookies?.accessToken,
			process.env.JWT_SECRET_KEY,
		);
		const { order_id } = req.params;

		const result = await readOrderService(order_id || null, user_id);

		if (result === -1) {
			return res
				.status(404)
				.json({ message: "Order not found", code: -1 });
		}

		if (result === -2) {
			return res.status(403).json({
				message: "You are not allowed to read this order.",
				code: -2,
			});
		}

		res.status(200).json(order_id ? { ...result } : { orders: result });
	} catch (error) {
		terminal.error(
			`order.controller.js | Read Order Error: ${error.message}`,
		);
		res.status(500).json({ message: "Unexpected error occurred" });
	}
};

/**
 * Soft delete an order.
 * @route DELETE /api/v1/orders/:order_id
 * @returns {Object} 200 - { message: 'Order deleted successfully' }
 * @returns {Object} 403 - { message: 'You are not allowed to delete this order' }
 * @returns {Object} 404 - { message: 'Order not found' }
 * @returns {Object} 400 - { message: 'Order is already deleted' }
 * @returns {Object} 500 - { message: 'Unexpected error occurred' }
 */
exports.deleteOrder = async (req, res) => {
	try {
		const { order_id } = req.params;
		const user_id = jwt.verify(
			req.cookies?.accessToken,
			process.env.JWT_SECRET_KEY,
		).user_id;

		const result = await deleteOrderService(order_id, user_id);

		switch (result) {
			case -1:
				return res
					.status(404)
					.json({ message: "Order not found", code: -1 });
			case -2:
				return res
					.status(400)
					.json({ message: "Order is already deleted", code: -2 });
			case -3:
				return res.status(403).json({
					message: "You are not allowed to delete this order",
					code: -3,
				});
			default:
				return res
					.status(200)
					.json({ message: "Order deleted successfully" });
		}
	} catch (error) {
		terminal.error(
			`order.controller.js | Delete Order Error: ${error.message}`,
		);
		res.status(500).json({ message: "Unexpected error occurred" });
	}
};
