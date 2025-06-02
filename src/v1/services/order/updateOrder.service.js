const { Order, Employee, Service } = require("../../models/index.model");
const uploadMedia = require("../cloudinary/uploadMedia.service");
const deleteMedia = require("../cloudinary/deleteMedia.service");
const terminal = require("../../../utils/terminal");
const createNotification = require("../notification/createNotification.service");

/**
 * Updates an existing order with authorization.
 *
 * @param {number} order_id - The ID of the order to update.
 * @param {number} user_id - The ID of the user making the request.
 * @param {Object} updateData - The fields to update.
 * @returns {Promise<Object|number>} Updated order with changed fields, or error codes (-1, -2, -4, -5, -6).
 */
module.exports = async (order_id, user_id, updateData) => {
	const order = await Order.findByPk(order_id, {
		include: { model: Service, as: "service", attributes: ["owner_id"] },
	});

	terminal.debug(order);

	if (!order) {
		terminal.warning(
			`updateOrder.service.js | Order ${order_id} not found.`,
		);
		return -1;
	}

	const isCustomer = order.customer_id === user_id;
	const isStoreOwner = order.service.owner_id === user_id;

	if (!isCustomer && !isStoreOwner) {
		terminal.warning(
			`updateOrder.service.js | User ${user_id} not authorized to update order ${order_id}.`,
		);
		return -4;
	}

	let updateFields = {};

	if (order.order_status === "COMPLETED") {
		const result = await handleCompletedOrderUpdate(
			isCustomer,
			updateData,
			updateFields,
			order,
		);
		if (typeof result === "number") return result;
	}

	if (order.order_status === "PROCESSING" && isCustomer) {
		const result = await handleCustomerProcessingToComplete(
			updateData,
			updateFields,
			order,
		);
		if (typeof result === "number") return result;
	}

	if (order.order_status === "PENDING" && isCustomer) {
		await handleCustomerPendingUpdate(updateData, updateFields, order);
	}

	if (isStoreOwner) {
		const result = await handleStoreUpdate(updateData, updateFields, order);
		if (typeof result === "number") return result;
	}

	if (Object.keys(updateFields).length === 0) {
		terminal.info(
			`updateOrder.service.js | No updates made for order ${order_id}.`,
		);
		return { message: "No changes applied", updated_fields: [] };
	}

	await order.update(updateFields);

	return {
		message: "Order updated successfully",
		updated_fields: Object.keys(updateFields),
		updated_order: updateFields,
	};
};

/**
 * Handles updates for completed orders (only feedback and rating).
 */
async function handleCompletedOrderUpdate(
	isCustomer,
	updateData,
	updateFields,
	order,
) {
	if (!isCustomer) {
		terminal.warning(
			`updateOrder.service.js | Only customers can update feedback & rating for COMPLETED orders.`,
		);
		return -4;
	}

	if (updateData.order_feedback)
		updateFields.order_feedback = updateData.order_feedback;

	if (updateData.order_rating !== undefined) {
		const rating = parseInt(updateData.order_rating, 10);
		if (isNaN(rating) || rating < 1 || rating > 5) {
			terminal.warning(
				`updateOrder.service.js | Invalid rating for order ${order.order_id}. Must be between 1 and 5.`,
			);
			return -5;
		}
		updateFields.order_rating = rating;
	}

	try {
		await createNotification(order.service.owner_id, {
			type: "ORDER_FEEDBACK",
			content: `Khách hàng đã đánh giá đơn hàng #${order.order_id}.`,
			link: `${order.order_id}`,
		});

		await createNotification(order.customer_id, {
			type: "ORDER_FEEDBACK",
			content: `Đánh đã giá đơn hàng #${order.order_id}.`,
			link: `${order.order_id}`,
		});
	} catch (error) {
		terminal.error(
			`updateOrder.service.js | Error creating notification: ${error.message}`,
		);
	}

	return updateFields;
}

/**
 * Allows customers to mark PROCESSING orders as COMPLETED.
 */
async function handleCustomerProcessingToComplete(
	updateData,
	updateFields,
	order,
) {
	if (updateData.order_status !== "COMPLETED") {
		terminal.warning(
			`updateOrder.service.js | Customer can only change order_status from PROCESSING to COMPLETED.`,
		);
		return -4;
	}

	updateFields.order_status = "COMPLETED";
	updateFields.order_description = `${order.order_description || ""} [Hoàn thành đơn hàng: ${updateData.order_description || ""}]`;

	try {
		await createNotification(order.service.owner_id, {
			type: "ORDER_COMPLETED",
			content: `Đã hoàn thành đơn hàng #${order.order_id}.`,
			link: `${order.order_id}`,
		});

		await createNotification(order.customer_id, {
			type: "ORDER_COMPLETED",
			content: `Đã hoàn thành đơn hàng #${order.order_id}.`,
			link: `${order.order_id}`,
		});
	} catch (error) {
		terminal.error(
			`updateOrder.service.js | Error creating notification: ${error.message}`,
		);
	}

	return updateFields;
}

/**
 * Handles customer updates for PENDING orders.
 */
const handleCustomerPendingUpdate = async (updateData, updateFields, order) => {
	if (updateData.order_status === "CANCELED") {
		updateFields.order_status = "CANCELED";
		updateFields.order_description = `${order.order_description || ""} [Khách hàng hủy đơn: ${updateData.order_description || ""}]`;

		try {
			await createNotification(order.service.owner_id, {
				type: "ORDER_CANCELED",
				content: `Khách hàng đã hủy đơn hàng #${order.order_id}.`,
				link: `${order.order_id}`,
			});

			await createNotification(order.customer_id, {
				type: "ORDER_CANCELED",
				content: `Đã hủy đơn hàng #${order.order_id}.`,
				link: `${order.order_id}`,
			});
		} catch (error) {
			terminal.error(
				`updateOrder.service.js | Error creating notification: ${error.message}`,
			);
		}

		return updateFields;
	}

	if (updateData.customer_full_name)
		updateFields.customer_full_name = updateData.customer_full_name;
	if (updateData.customer_phone_number)
		updateFields.customer_phone_number = updateData.customer_phone_number;
	if (updateData.order_description)
		updateFields.order_description = `[Khách hàng đặt đơn: ${updateData.order_description}]`;
	if (updateData.customer_address)
		updateFields.customer_address = updateData.customer_address;

	try {
		if (updateData.order_images) {
			updateFields.order_images_url = await uploadMedia.uploadImages(
				`order_${order.order_id}`,
				updateData.order_images,
			);
		} else {
			await deleteMedia.deleteImages(`order_${order.order_id}`);
			updateFields.order_images_url = null;
		}
	} catch (error) {
		terminal.error(
			`updateOrder.service.js | Error uploading images: ${error.message}`,
		);
	}

	try {
		await createNotification(order.service.owner_id, {
			type: "ORDER_UPDATED_INFO",
			content: `Khách hàng đã cập nhật đơn hàng #${order.order_id}.`,
			link: `${order.order_id}`,
		});

		await createNotification(order.customer_id, {
			type: "ORDER_UPDATED_INFO",
			content: `Đã cập nhật đơn hàng #${order.order_id}.`,
			link: `${order.order_id}`,
		});
	} catch (error) {
		terminal.error(
			`updateOrder.service.js | Error creating notification: ${error.message}`,
		);
	}

	return updateFields;
};

/**
 * Handles store updates, including PROCESSING (with employee assignment).
 */
async function handleStoreUpdate(updateData, updateFields, order) {
	if (
		!["PROCESSING", "CANCELED", "COMPLETED"].includes(
			updateData.order_status,
		)
	) {
		terminal.warning(
			`updateOrder.service.js | Store cannot change order_status to ${updateData.order_status}.`,
		);
		return -4;
	}

	updateFields.order_status = updateData.order_status;

	if (updateData.order_status === "PROCESSING") {
		if (!updateData.employee_id) {
			terminal.warning(
				`updateOrder.service.js | Employee ID is required when setting order to PROCESSING.`,
			);
			return -6;
		}

		const employee = await Employee.findByPk(updateData.employee_id);
		if (!employee) {
			terminal.warning(
				`updateOrder.service.js | Employee ${updateData.employee_id} not found.`,
			);
			return -2;
		}

		if (employee.owner_id !== order.service.owner_id) {
			terminal.warning(
				`updateOrder.service.js | Employee ${updateData.employee_id} does not belong to this service owner.`,
			);
			return -6;
		}

		updateFields.employee_id = employee.employee_id;
		updateFields.employee_full_name = employee.employee_full_name;

		try {
			await createNotification(order.service.owner_id, {
				type: "ORDER_UPDATED_PROCESSING",
				content: `Đã chấp nhận và tiến hành đơn hàng #${order.order_id}.`,
				link: `${order.order_id}`,
			});

			await createNotification(order.customer_id, {
				type: "ORDER_UPDATED_PROCESSING",
				content: `Cửa hàng đã chấp nhận và tiến hành đơn hàng #${order.order_id}.`,
				link: `${order.order_id}`,
			});
		} catch (error) {
			terminal.error(
				`updateOrder.service.js | Error creating notification: ${error.message}`,
			);
		}

		return updateFields;
	}

	if (updateData.order_status === "COMPLETED") {
		updateFields.order_description =
			updateData.order_status ===
			`${order.order_description || ""} [Hoàn thành đơn hàng: ${updateData.order_description || ""}]`;

		try {
			await createNotification(order.service.owner_id, {
				type: "ORDER_COMPLETED",
				content: `Đã hoàn thành đơn hàng #${order.order_id}.`,
				link: `${order.order_id}`,
			});

			await createNotification(order.customer_id, {
				type: "ORDER_COMPLETED",
				content: `Cửa hàng đã hoàn thành đơn hàng #${order.order_id}.`,
				link: `${order.order_id}`,
			});
		} catch (error) {
			terminal.error(
				`updateOrder.service.js | Error creating notification: ${error.message}`,
			);
		}

		return updateFields;
	}

	updateFields.order_description =
		updateData.order_status ===
		`${order.order_description || ""} [Cửa hàng hủy đơn: ${updateData.order_description || ""}]`;

	try {
		await createNotification(order.service.owner_id, {
			type: "ORDER_CANCELED",
			content: `Đã hủy đơn hàng #${order.order_id}.`,
			link: `${order.order_id}`,
		});

		await createNotification(order.customer_id, {
			type: "ORDER_CANCELED",
			content: `Cửa hàng đã hủy đơn hàng #${order.order_id}.`,
			link: `${order.order_id}`,
		});
	} catch (error) {
		terminal.error(
			`updateOrder.service.js | Error creating notification: ${error.message}`,
		);
	}

	return updateFields;
}
