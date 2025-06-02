const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/database.config");
const User = require("./user.model");
const Service = require("./service.model");
const Employee = require("./employee.model");

/**
 * @description Order Model
 * @typedef {Object} Order
 * @property {number} order_id - Unique identifier for the order.
 * @property {string} order_description - Description of the order.
 * @property {string} store_full_name - Store's full name at the time of order.
 * @property {string} store_address - Store's address at the time of order.
 * @property {string} store_phone_number - Store's phone number at the time of order.
 * @property {string} customer_full_name - Customer's full name at the time of order.
 * @property {string} customer_phone_number - Customer's phone number at the time of order.
 * @property {string} customer_address - Customer's address at the time of order.
 * @property {'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELED'} order_status - Order status.
 * @property {string} order_feedback - Customer feedback.
 * @property {Date} created_at - Timestamp when the order was created.
 * @property {Date} updated_at - Timestamp when the order was last updated.
 * @property {boolean} delete_flag - Soft delete flag.
 * @property {number} service_id - Reference to the service associated with the order.
 * @property {number} employee_id - Reference to the employee handling the order.
 * @property {number} customer_id - Reference to the customer who placed the order.
 */
const Order = sequelize.define(
	"Order",
	{
		order_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		order_description: { type: DataTypes.TEXT, allowNull: true },
		order_images_url: { type: DataTypes.TEXT, allowNull: true },
		order_status: {
			type: DataTypes.ENUM(
				"PENDING",
				"PROCESSING",
				"COMPLETED",
				"CANCELED",
			),
			defaultValue: "PENDING",
			allowNull: false,
		},
		order_feedback: { type: DataTypes.TEXT, allowNull: true },
		order_rating: { type: DataTypes.INTEGER, allowNull: true },
		order_rtc_session_id: { type: DataTypes.STRING(1000), allowNull: true },

		service_name: { type: DataTypes.TEXT, allowNull: false },
		service_description: { type: DataTypes.TEXT, allowNull: false },

		store_full_name: { type: DataTypes.TEXT, allowNull: false },
		store_address: { type: DataTypes.TEXT, allowNull: false },
		store_phone_number: { type: DataTypes.TEXT, allowNull: false },

		employee_full_name: { type: DataTypes.TEXT, allowNull: true },

		customer_full_name: { type: DataTypes.TEXT, allowNull: false },
		customer_phone_number: { type: DataTypes.TEXT, allowNull: false },
		customer_address: { type: DataTypes.TEXT, allowNull: false },

		delete_flag: { type: DataTypes.BOOLEAN, defaultValue: false },
		service_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: Service, key: "service_id" },
		},
		employee_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: { model: Employee, key: "employee_id" },
		},
		customer_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: User, key: "user_id" },
		},
	},
	{
		tableName: "orders",
		timestamps: true,
		underscored: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);

module.exports = Order;
