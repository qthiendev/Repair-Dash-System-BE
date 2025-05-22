const { DataTypes } = require("sequelize");
const sequelize = require("../../configs/database.config");
const User = require("./user.model");

/**
 * @description Payment Model
 * @typedef {Object} Payment
 * @property {number} payment_id - Unique identifier for the payment.
 * @property {string} transaction_id - Unique transaction identifier.
 * @property {string} payment_description - Description of the payment.
 * @property {'PENDING' | 'COMPLETED' | 'CANCELED'} payment_status - Status of the payment.
 * @property {string} user_full_name - Full name of the user making the payment.
 * @property {number} payment_amount - Amount of the payment.
 * @property {Date} created_at - Timestamp when the payment was created.
 * @property {Date} updated_at - Timestamp when the payment was last updated.
 * @property {boolean} delete_flag - Soft delete flag.
 * @property {number} user_id - Reference to the user who made the payment.
 */
const Payment = sequelize.define(
	"Payment",
	{
		payment_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		transaction_id: {
			type: DataTypes.STRING(500),
			allowNull: false,
			unique: true,
		},
		payment_description: { type: DataTypes.TEXT, allowNull: false },
		payment_type: {
			type: DataTypes.ENUM("MONTHLY", "YEARLY"),
			allowNull: false,
		},
		payment_status: {
			type: DataTypes.ENUM("PENDING", "COMPLETED", "CANCELED"),
			allowNull: false,
		},
		user_full_name: { type: DataTypes.STRING(500), allowNull: false },
		payment_amount: { type: DataTypes.INTEGER, allowNull: false },
		delete_flag: { type: DataTypes.BOOLEAN, defaultValue: false },
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: User, key: "user_id" },
		},
	},
	{
		tableName: "payments",
		timestamps: true,
		underscored: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	},
);

module.exports = Payment;
